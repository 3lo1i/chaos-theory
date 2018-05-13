import {Rect, Point} from './util';

export class AbstractDrawingTool {
  constructor(viewportWidth, viewportHeight) {
    if (this.constructor == AbstractDrawingTool) {
      throw new Error(`Abstract classes can't be instantiated.`);
    }
    this.boundingRect = new Rect();
    this.viewportRect = new Rect(0, 0, viewportWidth, viewportHeight);
    this.viewportRect.shrink(5);
  }

  start() {
    throw new Error(`Method not implemented.`);
  }

  moveTo(x, y) {
    throw new Error(`Method not implemented.`);
  }

  lineTo(x, y) {
    throw new Error(`Method not implemented.`);
  }

  finish() {
    throw new Error(`Method not implemented.`);
  }
}

export class DrawingTool extends AbstractDrawingTool {
  constructor(canvas, context) {
    super(canvas.width, canvas.height);
    this.canvas = canvas;
    this.context = context;
    this.lines = [];
  }

  start() {
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.lines.length = 0;
    this.boundingRect = new Rect();
  }

  moveTo(x, y) {
    const p = new Point(x, y);
    this.lines.push([p]);
    this.boundingRect.stretchToPoint(p);
  }

  lineTo(x, y) {
    if (!this.lines.length) {
      return;
    }
    const p = new Point(x, y);
    this.lines[this.lines.length - 1].push(p);
    this.boundingRect.stretchToPoint(p);
  }

  finish() {
    const rectangle = this.boundingRect;
    rectangle.notZero();
    const into = this.viewportRect;

    const fitRect = Rect.fit(rectangle, into);

    const factorX = fitRect.width / rectangle.width;
    const factorY = fitRect.height / rectangle.height;
    const factor = factorX < factorY ? factorX : factorY;
    const tx = -rectangle.x * factor + fitRect.x;
    const ty = -rectangle.y * factor + fitRect.y;

    // this.context.strokeRect(fitRect.x, fitRect.y, fitRect.width, fitRect.height);

    this.context.save();
    this.context.translate(tx, ty);
    // this.context.translate(-into.width / 2, -into.height / 2);
    this.context.scale(factor, factor);
    // this.context.translate(into.width / 2, into.height / 2);
    this.context.beginPath();
    let startPoint;
    let point;
    for (let i = 0; i < this.lines.length; i++) {
      let line = this.lines[i];
      point = line[0];
      startPoint = point;
      this.context.moveTo(point.x, point.y);
      for (let j = 1; j < line.length; j++) {
        point = line[j];
        this.context.lineTo(point.x, point.y);
      }
    }
    if (startPoint.eq(point)) {
      this.context.closePath();
    }
    this.context.lineWidth = this.context.lineWidth * 0.5 / factor;
    this.context.stroke();
    this.context.restore();
  }
}

export class SVGDrawingTool extends AbstractDrawingTool {
  constructor(svg) {
    super(svg.attr('width'), svg.attr('height'));
    this.svg = svg;
    this.pointsStack = [];
    this.stroke = { width: 1 };
    this.fill = 'none';
  }

  start() {
    this.svg.clear();
    this.pointsStack.length = 0;
    this.boundingRect = new Rect();
  }

  moveTo(x, y) {
    if (this.pointsStack.length) {
      this.svg.polyline(this.pointsStack).fill(this.fill).stroke(this.stroke);
    }
    this.pointsStack.length = 0;
    this.pointsStack.push([x, y]);
    this.boundingRect.stretchToPoint({x, y});
  }

  lineTo(x, y) {
    this.pointsStack.push([x, y]);
    this.boundingRect.stretchToPoint({x, y});
  }

  finish() {
    this.svg.polyline(this.pointsStack).fill(this.fill).stroke(this.stroke);
    this.pointsStack.length = 0;

    const rectangle = this.boundingRect;
    const into = this.viewportRect;

    const fitRect = Rect.fit(rectangle, into);

    const factorX = fitRect.width / rectangle.width;
    const factorY = fitRect.height / rectangle.height;
    const factor = factorX < factorY ? factorX : factorY;
    const tx = -rectangle.x * factor + fitRect.x;
    const ty = -rectangle.y * factor + fitRect.y;

    // this.svg.attr('transform', `translate(${ tx },${ ty }) scale(${ factor },${ factor })`);
    this.svg.translate(tx, ty);
    this.svg.scale(factor, factor);
  }
}

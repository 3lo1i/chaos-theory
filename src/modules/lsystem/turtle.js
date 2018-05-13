export default class Turtle {
  constructor(startX = 0, startY = 0, startAngle = 0, angleStep = 0, step = 10) {
    this.x = Number(startX);
    this.y = Number(startY);
    this.angle = Number(startAngle);
    this.angleStep = Number(angleStep);
    this.step = Number(step);
    this.posStack = [];
  }

  turnCW() {
    this.angle = (this.angle + this.angleStep) % 360;
  }

  turnCCW() {
    this.angle = (this.angle - this.angleStep) % 360;
  }

  moveForward() {
    const rad = this.angle / 180.0 * Math.PI;
    this.x += Math.cos(rad) * this.step;
    this.y += Math.sin(rad) * this.step;
  }

  start(startX, startY, startAngle) {
    this.x = Number(startX);
    this.y = Number(startY);
    this.angle = Number(startAngle);
    this.posStack.length = 0;
  }

  savePos() {
    this.posStack.push({'x': this.x, 'y': this.y, 'angle': this.angle});
  }

  restorePos() {
    if (!this.posStack.length) {
      return;
    }
    const pos = this.posStack.pop();
    this.x = pos.x;
    this.y = pos.y;
    this.angle = pos.angle;
  }

  drawPath(path, drawingTool) {
    drawingTool.start();
    drawingTool.moveTo(this.x, this.y);
    for (let i = 0; i < path.length; i++) {
      const command = path[i];
      switch (command) {
      case '-':
        this.turnCCW();
        break;
      case '+':
        this.turnCW();
        break;
      case 'b':
        this.moveForward();
        drawingTool.moveTo(this.x, this.y);
        break;
      case 'F':
        this.moveForward();
        drawingTool.lineTo(this.x, this.y);
        break;
      case '[':
        this.savePos();
        break;
      case ']':
        this.restorePos();
        drawingTool.moveTo(this.x, this.y);
        break;
      default:
        break;
      }
    }
    drawingTool.finish();
  }
}

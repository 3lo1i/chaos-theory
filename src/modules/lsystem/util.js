export class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Check if this point and argument are equal (have similar coordinates).
   * @param {Point} point - point to compare to.
   * @param {Number} epsilon - maximum difference in coordinates of two points.
   * @returns {Boolean} true, if points are close to each other, false otherwise.
   */
  eq(point, epsilon = 0.1) {
    return Math.abs(this.x - point.x) < epsilon && Math.abs(this.y - point.y) < epsilon;
  }
}

export class Rect {
  constructor(left = 0, top = 0, right = 0, bottom = 0) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  }

  get width() {
    return this.right - this.left;
  }

  get height() {
    return this.bottom - this.top;
  }

  get x() {
    return this.left;
  }

  get y() {
    return this.top;
  }

  /**
   * Move any side of rectangle to coordinates of point if its not inside rectangle.
   * @param {Point} x, y - point that will be inside this rectangle.
   */
  stretchToPoint({x, y}) {
    this.left = Math.min(this.left, x);
    this.right = Math.max(this.right, x);
    this.top = Math.min(this.top, y);
    this.bottom = Math.max(this.bottom, y);
  }

  /**
   * Expand dimentions of rectangle slightly if it have zero width or height.
   */
  notZero() {
    if (this.width === 0) {
      this.left -= 0.0001;
      this.right += 0.0001;
    }
    if (this.height === 0) {
      this.top -= 0.0001;
      this.bottom += 0.0001;
    }
  }

  /**
   * Subtracts padding from each side of rectangle.
   * Negative argument can be used to expand rectangle instead.
   * @param {Number} padding - Number of units to subtract from each side.
   */
  shrink(padding) {
    this.left += padding;
    this.top += padding;
    this.right -= padding;
    this.bottom -= padding;
  }

  /**
   * Creates new rectangle that has same aspect ratio as first argument that fitted and centered to second argument.
   * @param {Rect} rectangle - new Rect will have aspect ratio of this rectangle.
   * @param {Rect} into - new Rect will have dimentions that not exceeds this and will have center in same point.
   * @returns {Rect} new rectangle
   */
  static fit(rectangle, into) {
    let width   = rectangle.width;
    let height  = rectangle.height;
    const factorX = into.width  / width;
    const factorY = into.height / height;

    let factor = 1.0;

    factor = factorX < factorY ? factorX : factorY;
    width  *= factor;
    height *= factor;

    const x = into.x + (into.width  - width)  / 2;
    const y = into.y + (into.height - height) / 2;

    const fitRect = new Rect(x, y, x + width, y + height);
    return fitRect;
  };
}

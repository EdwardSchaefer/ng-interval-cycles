class Handle {
  radius: number;
  fill: string;
  index: number;
  initX: number;
  initY: number;
  cx: number;
  cy: number;
  lockAxis: string;
  dragBoundary: string;
  rectX: number;
  rectWidth: number;
  constructor(i: number) {
    this.index = i;
    this.initX = 100 * i;
    this.initY = 100;
    this.cx = 100 * i;
    this.cy = 100;
  }
}

export class VerticalHandle extends Handle {
  constructor(i: number) {
    super(i);
    this.radius = 10;
    this.fill = 'black';
    this.lockAxis = 'y';
    this.dragBoundary = '.circle-container';
    this.rectX = 0;
    this.rectWidth = 0;
  }
}

export class BezierHandle extends Handle {
  constructor(i: number) {
    super(i);
    this.radius = 5;
    this.fill = 'grey';
    this.lockAxis = '';
    this.dragBoundary = '.handle-container';
    this.rectX = (i * 100) - 100;
    this.rectWidth = 200;
  }
}

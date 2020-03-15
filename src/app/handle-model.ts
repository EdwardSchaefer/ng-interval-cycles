import {Vector} from './vector-model';

class Handle {
  radius: number;
  fill: string;
  index: number;
  initX: number;
  initY: number;
  coord: Vector;
  lockAxis: string;
  dragBoundary: string;
  rectX: number;
  rectWidth: number;
  constructor(i: number) {
    this.index = i;
    this.initX = 10 + (100 * i);
    this.initY = 100;
    this.coord = new Vector(100 * i, 100);
  }
  get coordString() {
    return this.coord.x + ' ' + this.coord.y + ' ';
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
    this.rectX = 10 + ((i * 100) - 100);
    this.rectWidth = 200;
  }
}

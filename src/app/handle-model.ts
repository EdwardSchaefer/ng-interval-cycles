import {Vector} from './vector-model';

class Handle {
  radius: number;
  fill: string;
  index: number;
  initX: number;
  initY: number;
  initXcss: string;
  initYcss: string;
  coord: Vector;
  lockAxis: string;
  dragBoundary: string;
  dragBoundaryClass: string;
  cssClass: string;
  rectX: number;
  rectWidth: number;
  constructor(i: number, offsetRadius: number) {
    this.index = i;
    this.initX = offsetRadius + (100 * i);
    this.initY = 100;
    this.coord = new Vector(100 * i, 100);
  }
  get coordString() {
    return this.coord.x + ' ' + this.coord.y + ' ';
  }
}

export class VerticalHandle extends Handle {
  constructor(i: number, offsetRadius: number) {
    super(i, offsetRadius);
    this.radius = offsetRadius;
    this.fill = 'black';
    this.lockAxis = 'y';
    this.dragBoundary = '.circle-container';
    this.dragBoundaryClass = 'vertical-container';
    this.cssClass = 'vertical-handle';
    this.initXcss = '0';
    this.initYcss = '90px';
    this.rectX = 0;
    this.rectWidth = 0;
  }
}

export class BezierHandle extends Handle {
  constructor(i: number, offsetRadius: number) {
    super(i, offsetRadius);
    this.radius = offsetRadius / 2;
    this.fill = 'grey';
    this.lockAxis = '';
    this.dragBoundary = '.bezier-container';
    this.dragBoundaryClass = 'bezier-container';
    this.cssClass = 'bezier-handle';
    this.initXcss = '85px';
    this.initYcss = '90px';
    this.rectX = offsetRadius + ((i * 100) - 100);
    this.rectWidth = 200;
  }
}

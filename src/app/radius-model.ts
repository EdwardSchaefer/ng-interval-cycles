import {Interval} from './interval-model';

export class Radius {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  offset = 90;
  stroke: string;
  opacity = 100;
  constructor(interval: Interval, radius: number) {
    const degrees = ((interval.value / interval.temperament) * 360) - this.offset;
    const radians = (degrees * Math.PI / 180);
    this.x1 = radius;
    this.y1 = radius;
    this.x2 = (radius * Math.cos(radians)) + radius;
    this.y2 = (radius * Math.sin(radians)) + radius;
    this.stroke = interval.color.backgroundColor;
  }
}

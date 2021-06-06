import {Note} from './note.model';

export class Radius {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  transform: string;
  offset = 90;
  stroke: string;
  strokeDashArray: string;
  note: Note;
  constructor(note: Note, radius: number, circleType: string) {
    this.note = note;
    const degrees = ((note.interval.value / note.interval.temperament) * 360) - this.offset;
    const radians = (degrees * Math.PI / 180);
    const transformDegrees = degrees - (360 / note.interval.temperament) / 2;
    this.transform = 'rotate(' + transformDegrees + ')';
    this.x1 = radius;
    this.y1 = circleType === 'radius' ? radius : 0;
    this.x2 = (radius * Math.cos(radians)) + radius;
    this.y2 = (radius * Math.sin(radians)) + radius;
    this.stroke = note.interval.color.backgroundColor;
    const tempReciprocal = (1 / note.interval.temperament);
    const sdrStoke = tempReciprocal * (Math.PI * radius);
    const sdrGap = (1 - tempReciprocal) * (Math.PI * radius);
    this.strokeDashArray = sdrStoke + ' ' + sdrGap;
  }
}

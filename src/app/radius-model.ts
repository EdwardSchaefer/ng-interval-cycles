import {Interval} from './interval-model';
import {Note} from "./note.model";

export class Radius {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  offset = 90;
  stroke: string;
  opacity = 100;
  noteAnalyser;
  constructor(note: Note, radius: number) {
    const degrees = ((note.interval.value / note.interval.temperament) * 360) - this.offset;
    const radians = (degrees * Math.PI / 180);
    this.x1 = radius;
    this.y1 = radius;
    this.x2 = (radius * Math.cos(radians)) + radius;
    this.y2 = (radius * Math.sin(radians)) + radius;
    this.stroke = note.interval.color.backgroundColor;
    this.noteAnalyser = note.noteAnalyser;
  }
}

import {AfterViewInit, Component} from '@angular/core';
import {SynthService} from '../synth.service';
import {Vector} from '../vector-model';
import {VerticalHandle, BezierHandle} from '../handle-model';
import {Note} from '../note.model';

@Component({
  selector: 'nic-envelope',
  templateUrl: './envelope.component.html',
  styleUrls: ['./envelope.component.css']
})
export class EnvelopeComponent implements AfterViewInit {
  envelope: Envelope;
  nodeCount = 7;
  offsetRadius = 10;
  height = 200;
  width = (this.height * this.nodeCount / 2) - ((this.height / 2) - this.offsetRadius * 2);
  debugX = 0;
  notes: Note[] = [];
  constructor(public synth: SynthService) {
    this.envelope = new Envelope(this.nodeCount, this.height, this.offsetRadius);
    const curve = this.envelope.getCurve();
    this.synth.curve.next(curve);
    this.synth.note.subscribe(note => {
      this.notes.push(note);
      note.stopped.subscribe(stopped => {
        if (stopped) {
          this.notes = this.notes.filter(n => n !== note);
        }
      });
    });
  }
  ngAfterViewInit(): void {
    this.draw();
  }
  draw() {
    const timesReducer = (acc, curr) => Math.abs(curr - 128) > acc ? Math.abs(curr - 128) : acc;
    this.notes.forEach(note => {
      const times = new Uint8Array(note.noteAnalyser.frequencyBinCount);
      note.noteAnalyser.getByteTimeDomainData(times);
      note.opacity = times.reduce(timesReducer, 0) / 128;
      if (!note.sustained) {
        note.xPosition = -1000 * (note.startTime - note.context.currentTime) + note.xOffset;
      } else {
        note.xPosition = note.xOffset + 400;
      }
    });
    requestAnimationFrame(this.draw.bind(this));
  }
  update(event, handle: (VerticalHandle | BezierHandle)) {
    const transform: string = event.source.element.nativeElement.style.transform;
    const coords = transform.substring(12).split(',');
    handle.coord.x = parseInt(coords[0].split('px')[0], 10) + handle.initX;
    handle.coord.y = parseInt(coords[1].split('px')[0], 10) + handle.initY;
    const curve = this.envelope.getCurve();
    this.synth.curve.next(curve);
  }
  debug(event) {
    this.debugX = event.x;
  }
}

class Envelope {
  handles: (VerticalHandle[] | BezierHandle[]) = [];
  height: number;
  // debugCurveRef: number[] = [];
  // debugPathRef = '';
  constructor(nodes: number, height: number, offsetRadius: number) {
    this.height = height;
    for (let i = 0; i < nodes; i++) {
      this.handles.push(i % 2 ? new BezierHandle(i, offsetRadius) : new VerticalHandle(i, offsetRadius));
    }
  }
  // get debugPath(): string {
  //   let result = 'M 0 100 ';
  //   this.debugCurveRef.forEach((y, x) => {
  //     result = result + 'L ' + x + ' ' + (200 - (y * 200)) + ' ';
  //   });
  //   this.debugPathRef = result;
  //   return result;
  // }
  get path(): string {
    let result = '';
    this.handles.forEach((handle, index) => {
      let svgCommand = 'M';
      if (index) {
        svgCommand = index % 2 ? 'Q' : '';
      }
      result = result + svgCommand + handle.coordString;
    });
    return result;
  }
  getV(index: number): Vector {
    return this.handles[index].coord;
  }
  getT(x: number, b: number, c: number, d: number): number {
    const sqrt = (x * b) + (x * d) - (2 * x * c) + Math.pow(c, 2) - (b * d);
    const q = (b - c + (Math.sqrt(Math.abs(sqrt))));
    const r = (b - (2 * c) + d);
    const result = q / r;
    if (isNaN(result)) {
      return 0;
    } else {
      return result;
    }
  }
  getY(t: number, b: number, c: number, d: number): number {
    return Math.pow((1 - t), 2) * b + 2 * (1 - t) * t * c + Math.pow(t, 2) * d;
  }
  getH(time: number, handle: VerticalHandle): number {
    if (handle instanceof VerticalHandle) {
      const index = handle.index;
      const scaling = (handle.coord.timing / this.height);
      const b = this.getV(index).x * scaling;
      const c = this.getV(index + 1).x * scaling;
      const d = this.getV(index + 2).x * scaling;
      const t = this.getT(time, b, c, d);
      return this.getY(t, this.getV(index).y, this.getV(index + 1).y, this.getV(index + 2).y);
    }
    return 0;
  }
  getCurve(): number[][] {
    const curve = [];
    let totalTiming = 0;
    for (const handle of this.handles) {
      let coordTiming = 0;
      if (handle instanceof VerticalHandle && handle.index < 6) {
        curve.push([]);
        while (coordTiming < handle.coord.timing) {
          curve[handle.index / 2].push(1 - (this.getH(totalTiming, handle) / this.height));
          coordTiming ++;
          totalTiming ++;
        }
      }
    }
    // this.debugCurveRef = curve;
    return curve;
  }
}

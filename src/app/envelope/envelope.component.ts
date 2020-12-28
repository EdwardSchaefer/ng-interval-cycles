import {Component} from '@angular/core';
import {SynthService} from '../synth.service';
import {Vector} from '../vector-model';
import {VerticalHandle, BezierHandle} from '../handle-model';

@Component({
  selector: 'nic-envelope',
  templateUrl: './envelope.component.html',
  styleUrls: ['./envelope.component.css']
})
export class EnvelopeComponent {
  envelope: Envelope;
  nodeCount = 7;
  offsetRadius = 10;
  height = 200;
  width = (this.height * this.nodeCount / 2) - ((this.height / 2) - this.offsetRadius * 2);
  debugX = 0;
  constructor(public synth: SynthService) {
    this.envelope = new Envelope(this.nodeCount, this.height, this.offsetRadius);
    const curve = this.envelope.getCurve();
    this.synth.curve.next(curve);
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
  constructor(nodes: number, height: number, offsetRadius: number) {
    this.height = height;
    for (let i = 0; i < nodes; i++) {
      this.handles.push(i % 2 ? new BezierHandle(i, offsetRadius) : new VerticalHandle(i, offsetRadius));
    }
  }
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
  getH(time: number, start: number): number {
    const t = this.getT(time, this.getV(start).x, this.getV(start + 1).x, this.getV(start + 2).x);
    return this.getY(t, this.getV(start).y, this.getV(start + 1).y, this.getV(start + 2).y);
  }
  getCurve(): number[] {
    const curve = [];
    let totalTiming = 0;
    for (const handle of this.handles) {
      let coordTiming = 0;
      if (handle instanceof VerticalHandle && handle.index < 6) {
        while (coordTiming < handle.coord.timing) {
          curve.push(1 - (this.getH(totalTiming, handle.index) / 200));
          coordTiming ++;
          totalTiming ++;
        }
      }
    }
    return curve;
  }
}

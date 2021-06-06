import {BezierHandle, VerticalHandle} from './handle-model';
import {Vector} from './vector-model';

export class Envelope {
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
    return curve;
  }
}

import {Interval} from './interval-model';
import {Vector} from './vector-model';

export class OscGainController {
  osc: OscillatorNode;
  gain: GainNode;
  constructor(osc: OscillatorNode, gain: GainNode, interval: Interval, curve: Vector[], context) {
    this.osc = osc;
    this.gain = gain;
    this.osc.type = 'sine';
    this.osc.frequency.value = interval.frequency;
    // this.gain.connect(this.analyser);
    this.gain.gain.value = 1;
    this.osc.connect(this.gain);
    this.play(curve, context);
  }
  play(curve: Vector[], context) {
    let contextTime = context.currentTime;
    let curveTime = 0;
    this.osc.start();
    while (curveTime < curve[0].timing) {
      curveTime = curveTime + 1;
      const gainValue = 1 - (this.getHeight(curveTime, 0, curve) / 200);
      this.gain.gain.setValueAtTime(gainValue, contextTime);
      contextTime = contextTime + 0.001;
    }
    setTimeout(() => {
      this.stop();
    }, 200);
  }
  stop() {
    this.gain.disconnect();
    this.osc.disconnect();
    this.osc.stop();
  }
  releaseNote() {

  }
  getCurve(x: number, b: number, c: number, d: number): number {
    return (b - c + (Math.sqrt((x * b) + (x * d) - (2 * x * c) + Math.pow(c, 2) - (b * d)))) / (b - (2 * c) + d);
  }
  getY(t: number, b: number, c: number, d: number): number {
    return Math.pow((1 - t), 2) * b + 2 * (1 - t) * t * c + Math.pow(t, 2) * d;
  }
  getHeight(time: number, section: number, vectors: Vector[]): number {
    const curve = this.getCurve(time, vectors[section].x, vectors[section + 1].x, vectors[section + 2].x);
    return this.getY(curve, vectors[section].y, vectors[section + 1].y, vectors[section + 2].y);
  }
}

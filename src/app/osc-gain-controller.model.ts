import {Interval} from './interval-model';
import {Vector} from './vector-model';

export class OscGainController {
  osc: OscillatorNode;
  gain: GainNode;
  contextStart: number;
  constructor(osc: OscillatorNode, gain: GainNode, interval: Interval, curve: number[], context) {
    this.osc = osc;
    this.gain = gain;
    this.osc.type = 'sine';
    this.osc.frequency.value = interval.frequency;
    // this.gain.connect(this.analyser);
    this.gain.gain.value = 0.5;
    this.osc.connect(this.gain);
    this.play(curve, context);
  }
  play(curve: number[], context) {
    const playTime = curve.length;
    this.contextStart = context.currentTime;
    let contextTime = this.contextStart;
    let curveTime = 0;
    this.osc.start();
    while (curveTime < curve.length) {
      const gainValue = curve[curveTime];
      this.gain.gain.setValueAtTime(gainValue, contextTime);
      curveTime = curveTime + 1;
      contextTime = contextTime + 0.001;
    }
    setTimeout(() => {
      this.stop();
    }, playTime);
  }
  stop() {
    this.gain.disconnect();
    this.osc.disconnect();
    this.osc.stop();
  }
  releaseNote() {

  }
}

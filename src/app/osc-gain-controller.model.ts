import {Interval} from './interval-model';

export class OscGainController {
  osc: OscillatorNode;
  gain: GainNode;
  constructor(osc: OscillatorNode, gain: GainNode, interval: Interval) {
    this.osc = osc;
    this.gain = gain;
    this.osc.type = 'sine';
    this.osc.frequency.value = interval.frequency;
    // this.gain.connect(this.analyser);
    this.gain.gain.value = 1;
    this.osc.connect(this.gain);
    this.osc.start();
  }
  stop() {
    this.gain.disconnect();
    this.osc.disconnect();
    this.osc.stop();
  }
}

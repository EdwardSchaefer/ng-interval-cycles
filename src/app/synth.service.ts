import { Injectable } from '@angular/core';
import {Interval} from './interval-model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SynthService {
  initialized: boolean;
  context: AudioContext;
  analyser: AnalyserNode;
  interval: Subject<Interval> = new Subject<Interval | null>();
  constructor() {}
  initialize() {
    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.analyser.connect(this.context.destination);
    this.initialized = true;
  }
  play(interval: Interval): OscillatorNode {
    if (!this.initialized) {
      this.initialize();
    }
    this.interval.next(interval);
    const osc: OscillatorNode = this.context.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = interval.frequency;
    const gain: GainNode = this.context.createGain();
    gain.connect(this.analyser);
    gain.gain.value = 1;
    osc.connect(gain);
    osc.start();
    return osc;
  }
  stop(osc: OscillatorNode) {
    osc.disconnect();
    osc.stop();
  }
}

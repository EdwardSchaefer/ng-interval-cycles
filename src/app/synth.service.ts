import { Injectable } from '@angular/core';
import {Interval} from './interval-model';
import {Observable, Subject} from 'rxjs';
import {OscGain} from './osc-gain-interface';

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
  play(interval: Interval): OscGain {
    if (!this.initialized) {
      this.initialize();
    }
    this.interval.next(interval);
    const osc: OscillatorNode = this.context.createOscillator();
    const gain: GainNode = this.context.createGain();
    const oscGain: OscGain = {osc, gain};
    oscGain.osc.type = 'sine';
    oscGain.osc.frequency.value = interval.frequency;
    oscGain.gain.connect(this.analyser);
    oscGain.gain.gain.value = 1;
    oscGain.osc.connect(oscGain.gain);
    oscGain.osc.start();
    return oscGain;
  }
  stop(oscGain: OscGain) {
    oscGain.gain.disconnect();
    oscGain.osc.disconnect();
    oscGain.osc.stop();
  }
}

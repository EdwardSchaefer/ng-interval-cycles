import { Injectable } from '@angular/core';
import {Interval} from './interval-model';

@Injectable({
  providedIn: 'root'
})
export class SynthService {
  initialized: boolean;
  context: AudioContext;
  osc: OscillatorNode;
  gain: GainNode;
  analyser: AnalyserNode;
  constructor() {}
  initialize() {
    this.context = new AudioContext();
    this.initialized = true;
  }
  play(interval: Interval) {
    if (!this.initialized) {
      this.initialize();
    }
    this.osc = this.context.createOscillator();
    this.osc.type = 'sine';
    this.osc.frequency.value = interval.frequency;
    this.gain = this.context.createGain();
    this.analyser = this.context.createAnalyser();
    this.gain.connect(this.analyser);
    this.analyser.connect(this.context.destination);
    this.gain.gain.value = 1;
    this.osc.connect(this.gain);
    this.osc.start();
  }
  stop(interval: Interval) {
    if (this.initialized) {
      if (this.gain && this.osc) {
        this.gain.disconnect();
        this.osc.stop();
        this.osc.disconnect();
      }
    }
  }
}

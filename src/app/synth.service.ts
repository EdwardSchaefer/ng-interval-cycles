import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SynthService {
  initialized: boolean;
  osc;
  gain;
  constructor() {}
  initialize() {
    const context = new AudioContext();
    this.osc = context.createOscillator();
    this.osc.type = 'sine';
    this.gain = context.createGain();
    this.gain.connect(context.destination);
    this.gain.gain.value = 0;
    this.osc.start(0);
    this.osc.connect(this.gain);
    this.initialized = true;
  }
  setFrequency(value) {
    if (this.initialized) {
      this.osc.frequency.value = value;
      this.gain.gain.value = 100;
    }
  }
  stop() {
    if (this.initialized) {
      this.gain.gain.value = 0;
    }
  }
}

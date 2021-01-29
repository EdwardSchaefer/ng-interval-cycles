import { Injectable } from '@angular/core';
import {Interval} from './interval-model';
import {BehaviorSubject, Subject} from 'rxjs';
import {OscGainController} from './osc-gain-controller.model';

@Injectable({
  providedIn: 'root'
})
export class SynthService {
  initialized: boolean;
  context: AudioContext;
  analyser: AnalyserNode;
  interval: Subject<Interval> = new Subject<Interval | null>();
  curve: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>([]);
  constructor() {
    // this.curve.subscribe(a => {
    //   console.log(a);
    // });
  }
  initialize() {
    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.analyser.connect(this.context.destination);
    this.initialized = true;
  }
  play(interval: Interval): OscGainController {
    if (!this.initialized) {
      this.initialize();
    }
    this.interval.next(interval);
    const osc: OscillatorNode = this.context.createOscillator();
    const gain: GainNode = this.context.createGain();
    const oscGain = new OscGainController(osc, gain, interval, this.curve.getValue(), this.context);
    oscGain.gain.connect(this.analyser);
    return oscGain;
  }

}

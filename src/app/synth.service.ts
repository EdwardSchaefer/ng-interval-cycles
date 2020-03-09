import { Injectable } from '@angular/core';
import {Interval} from './interval-model';
import {Observable, Subject} from 'rxjs';
import {OscGainController} from './osc-gain-controller.model';
import {Vector} from './vector-model';

@Injectable({
  providedIn: 'root'
})
export class SynthService {
  initialized: boolean;
  context: AudioContext;
  analyser: AnalyserNode;
  interval: Subject<Interval> = new Subject<Interval | null>();
  curve: Subject<Vector[]> = new Subject<Vector[]>();
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
    const oscGain = new OscGainController(osc, gain, interval);
    oscGain.gain.connect(this.analyser);
    return oscGain;
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

import { Injectable } from '@angular/core';
import {Interval} from './interval-model';
import {BehaviorSubject, Subject} from 'rxjs';
import {Note} from './note.model';

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
  play(interval: Interval): Note {
    if (!this.initialized) {
      this.initialize();
    }
    this.interval.next(interval);
    const osc: OscillatorNode = this.context.createOscillator();
    const gain: GainNode = this.context.createGain();
    const note = new Note(osc, gain, interval, this.curve.getValue(), this.context);
    note.gain.connect(this.analyser);
    return note;
  }
}

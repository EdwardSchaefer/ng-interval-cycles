import { Injectable } from '@angular/core';
import {Interval} from './interval-model';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {Note} from './note.model';

@Injectable({
  providedIn: 'root'
})
export class SynthService {
  initialized: boolean;
  context: AudioContext;
  analyser: AnalyserNode;
  note: Subject<Note> = new Subject<Note>();
  curve: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>([]);
  amplitude: Subject<number> = new Subject<number>();
  constructor() {}
  initialize() {
    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.analyser.connect(this.context.destination);
    this.initialized = true;
    this.draw();
  }
  generateNote(interval: Interval): Observable<Note> {
    if (!this.initialized) {
      this.initialize();
    }
    const osc: OscillatorNode = this.context.createOscillator();
    const gain: GainNode = this.context.createGain();
    const curve = this.curve.getValue();
    const context = this.context;
    const note = new Note({osc, gain, interval, curve, context});
    note.gain.connect(this.analyser);
    return of(note);
  }
  draw() {
    const times = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(times);
    let greatestValue = 0;
    for (let i = 0; i < times.length; i++) {
      const value = Math.abs(times[i] - 128);
      if (value > greatestValue) {
        greatestValue = value;
      }
    }
    this.amplitude.next(greatestValue / 128);
    requestAnimationFrame(this.draw.bind(this));
  }
}

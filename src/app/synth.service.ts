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
  constructor() {}
  initialize() {
    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.analyser.connect(this.context.destination);
    this.initialized = true;
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
    note.noteAnalyser.connect(this.analyser);
    this.note.next(note);
    return of(note);
  }
}

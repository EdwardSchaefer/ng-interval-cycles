import { Injectable } from '@angular/core';
import {Interval} from './interval-model';
import {BehaviorSubject, fromEvent, merge, Observable, Subject} from 'rxjs';
import {Note} from './note.model';
import {filter, first, map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SynthService {
  initialized: boolean;
  context: AudioContext;
  analyser: AnalyserNode;
  play: Subject<Interval> = new Subject<Interval>();
  curve: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>([]);
  keyDown: Observable<any> = fromEvent(document, 'keydown').pipe(
    filter(((event: KeyboardEvent) => !this.pressedKeys.map(key => key.interval.key).includes(event.key))),
    map((event: KeyboardEvent) => this.validKeys.indexOf(event.key)),
    filter(index => index >= 0)
  );
  defaultKeys: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'q', 'w', 'e', 'r', 't', 'y', 'u',
    'i', 'o', 'p', 'a', 's', 'd', 'f'];
  validKeys: string[] = [];
  pressedKeys: Note[] = [];
  constructor() {
    this.play.subscribe(interval => {
      const note = this.generateNote(interval);
      if (interval.key) {
        this.pressedKeys.push(note);
        const keyup = fromEvent(document, 'keyup').pipe(
          filter((key: KeyboardEvent) => this.validKeys.includes(key.key)),
          first()
        );
        keyup.subscribe(next => {
          note.releaseNote();
          this.pressedKeys = this.pressedKeys.filter(key => key.interval.key !== interval.key).slice();
        });
      } else {
        const up = fromEvent(event.target, 'mouseup').pipe(take(1));
        const leave = fromEvent(event.target, 'mouseleave').pipe(take(1));
        merge(up, leave).subscribe(a => {
          note.releaseNote();
        });
      }
    });
  }
  initialize() {
    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.analyser.connect(this.context.destination);
    this.initialized = true;
  }
  generateNote(interval: Interval): Note {
    if (!this.initialized) {
      this.initialize();
    }
    const osc: OscillatorNode = this.context.createOscillator();
    const gain: GainNode = this.context.createGain();
    const curve = this.curve.getValue();
    const context = this.context;
    const note = new Note({osc, gain, interval, curve, context});
    note.gain.connect(this.analyser);
    return note;
  }
}

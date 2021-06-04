import {Component, Input, OnChanges} from '@angular/core';
import {Interval} from '../interval-model';
import {SynthService} from '../synth.service';
import {from, fromEvent, merge, Observable, Subscription} from 'rxjs';
import {filter, map, switchMap, take} from 'rxjs/operators';
import {Note} from '../note.model';
import {MidiService} from '../midi.service';

@Component({
  selector: 'nic-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent {
  // no longer a matrix
  matrix: Interval[] = [];
  selectedMatrixDisplay: 'key' | 'value';
  matrixContainer: {maxWidth: string, maxHeight: string};
  defaultKeys: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'q', 'w', 'e', 'r', 't', 'y', 'u',
    'i', 'o', 'p', 'a', 's', 'd', 'f'];
  validKeys: string[] = [];
  keyDown: Observable<Note> = fromEvent(document, 'keydown').pipe(
    filter((key: KeyboardEvent) => !key.repeat && this.validKeys.includes(key.key)),
    map((key: KeyboardEvent) => this.matrix.find(interval => interval.key === key.key)),
    switchMap((interval: Interval) => this.synth.generateNote(interval))
  );
  midiSub: Subscription;
  constructor(public synth: SynthService, public midi: MidiService) {
    this.synth.selectedMatrixDisplay.subscribe(display => this.selectedMatrixDisplay = display);
    this.synth.selectedTemp.subscribe(temperament => {
      this.matrix = [];
      const styleValue = (50 * (temperament.value + 1)) + 'px';
      this.matrixContainer = {maxWidth: styleValue, maxHeight: styleValue};
      this.validKeys = this.defaultKeys.slice(0, temperament.value);
      for (let i = 0; i <= temperament.value; i++) {
        for (let j = 0; j <= temperament.value; j++) {
          const value = (i * j) % temperament.value;
          this.matrix.push(new Interval(temperament.value, value, this.validKeys[value]));
        }
      }
    });
    this.keyDown.subscribe(note => {
      const keyup: Observable<KeyboardEvent> = fromEvent(document, 'keyup').pipe(
        filter((key: KeyboardEvent) => key.key === note.interval.key),
        take(1)
      );
      keyup.subscribe(keyUpEvent => note.releaseNote());
    });
    this.midi.midiLoaded.subscribe(loaded => {
      if (loaded) {
        // unsubscribe ?
        this.midiSub = this.midi.midiDown.subscribe(midiDown => {
          const temperament = this.matrix[0].temperament;
          const interval = this.matrix.find(intervalValue => midiDown % temperament === intervalValue.value);
          const note = this.synth.generateNote(interval);
          const midiUp: Observable<any> = from(this.midi.midiUp).pipe(
            filter((intervalValue: number) => intervalValue === midiDown),
            take(1)
          );
          note.subscribe(noteRef => midiUp.subscribe(a => noteRef.releaseNote()));
        });
      }
    });
  }
  clickPlay(event, interval: Interval) {
    const noteObs = this.synth.generateNote(interval);
    const up = fromEvent(event.target, 'mouseup').pipe(take(1));
    const leave = fromEvent(event.target, 'mouseleave').pipe(take(1));
    merge(up, leave).pipe(take(1), switchMap(() => noteObs)).subscribe(note => note.releaseNote());
  }
}

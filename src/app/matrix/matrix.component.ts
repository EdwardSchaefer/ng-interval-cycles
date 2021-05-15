import {Component, Input, OnChanges} from '@angular/core';
import {Temperament} from '../temperament-model';
import {Interval} from '../interval-model';
import {SynthService} from '../synth.service';
import {fromEvent, merge, Observable} from 'rxjs';
import {filter, first, map, take} from 'rxjs/operators';
import {Note} from '../note.model';

@Component({
  selector: 'nic-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnChanges {
  @Input() temperament: Temperament;
  // no longer a matrix
  matrix: Interval[] = [];
  matrixContainer: {maxWidth: string, maxHeight: string};
  defaultKeys: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'q', 'w', 'e', 'r', 't', 'y', 'u',
    'i', 'o', 'p', 'a', 's', 'd', 'f'];
  validKeys: string[] = [];
  pressedKeys: Note[] = [];
  keyDown: Observable<any> = fromEvent(document, 'keydown').pipe(
    filter(((event: KeyboardEvent) => !this.pressedKeys.map(key => key.interval.key).includes(event.key))),
    map((event: KeyboardEvent) => this.validKeys.indexOf(event.key)),
    filter(index => index >= 0)
  );
  constructor(public synth: SynthService) {
    this.keyDown.subscribe((index: number) => {
      const interval = this.matrix[index + this.temperament.value + 1];
      const note = this.synth.generateNote(interval);
      this.pressedKeys.push(note);
      const keyup = fromEvent(document, 'keyup').pipe(
        filter((key: KeyboardEvent) => this.validKeys.includes(key.key)),
        first()
      );
      keyup.subscribe(next => {
        note.releaseNote();
        this.pressedKeys = this.pressedKeys.filter(key => key.interval.key !== interval.key).slice();
      });
      this.synth.note.next(note);
    });
  }
  ngOnChanges() {
    this.matrix = [];
    const styleValue = (50 * (this.temperament.value + 1)) + 'px';
    this.matrixContainer = {maxWidth: styleValue, maxHeight: styleValue};
    this.validKeys = this.defaultKeys.slice(0, this.temperament.value);
    for (let i = 0; i <= this.temperament.value; i++) {
      for (let j = 0; j <= this.temperament.value; j++) {
        const value = (i * j) % this.temperament.value;
        this.matrix.push(new Interval(this.temperament.value, value, this.validKeys[value]));
      }
    }
  }
  clickPlay(event, interval: Interval) {
    const note = this.synth.generateNote(interval);
    const up = fromEvent(event.target, 'mouseup').pipe(take(1));
    const leave = fromEvent(event.target, 'mouseleave').pipe(take(1));
    merge(up, leave).subscribe(a => {
      note.releaseNote();
    });
    this.synth.note.next(note);
  }
}

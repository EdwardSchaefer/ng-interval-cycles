import {Component, HostListener, Input, OnChanges} from '@angular/core';
import {Temperament} from '../temperament-model';
import {Interval} from '../interval-model';
import {SynthService} from '../synth.service';
import {fromEvent} from 'rxjs';
import {filter, first, take} from 'rxjs/operators';
import {merge} from 'rxjs';
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
  clickOsc: Note;
  defaultKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'q', 'w'];
  pressedKeys: Note[] = [];
  matrixContainer: {maxWidth: string, maxHeight: string};
  @HostListener('document: keydown', ['$event'])
  keyPlay(event) {
    const index = this.defaultKeys.indexOf(event.key);
    const pressedKey = this.pressedKeys.find(key => key.key === event.key);
    if (index >= 0 && !pressedKey) {
      const interval = this.matrix[index + this.temperament.value + 1];
      interval.keyedNote = event.key;
      const note = this.synth.play(interval);
      this.pressedKeys.push(note);
      const keyup = fromEvent(document, 'keyup').pipe(filter((key: any) => key.key === interval.keyedNote), first());
      keyup.subscribe(next => {
        note.releaseNote();
        this.pressedKeys = this.pressedKeys.filter(key => key.key !== interval.keyedNote).slice();
      });
    }
  }
  constructor(public synth: SynthService) {}
  ngOnChanges() {
    this.matrix = [];
    const styleValue = (50 * (this.temperament.value + 1)) + 'px';
    this.matrixContainer = {maxWidth: styleValue, maxHeight: styleValue};
    for (let i = 0; i <= this.temperament.value; i++) {
      // this.matrix.push([]);
      for (let j = 0; j <= this.temperament.value; j++) {
        const value = (i * j) % this.temperament.value;
        this.matrix.push(new Interval(this.temperament.value, value));
      }
    }
  }
  clickPlay(event, interval: Interval) {
    const clickOsc = this.synth.play(interval);
    const up = fromEvent(event.target, 'mouseup').pipe(take(1));
    const leave = fromEvent(event.target, 'mouseleave').pipe(take(1));
    merge(up, leave).subscribe(a => {
      clickOsc.releaseNote();
      this.synth.interval.next(null);
    });
  }
  stop(event, interval: Interval) {
    if (this.clickOsc) {
      this.clickOsc.releaseNote();
      this.synth.interval.next(null);
    }
  }
}

import {Component, Input, OnChanges} from '@angular/core';
import {Temperament} from '../temperament-model';
import {Interval} from '../interval-model';
import {SynthService} from '../synth.service';

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
  constructor(public synth: SynthService) {
    this.synth.keyDown.subscribe((index: number) => {
      const interval = this.matrix[index + this.temperament.value + 1];
      this.synth.play(interval);
    });
  }
  ngOnChanges() {
    this.matrix = [];
    const styleValue = (50 * (this.temperament.value + 1)) + 'px';
    this.matrixContainer = {maxWidth: styleValue, maxHeight: styleValue};
    this.synth.validKeys = this.synth.defaultKeys.slice(0, this.temperament.value);
    for (let i = 0; i <= this.temperament.value; i++) {
      for (let j = 0; j <= this.temperament.value; j++) {
        const value = (i * j) % this.temperament.value;
        this.matrix.push(new Interval(this.temperament.value, value, this.synth.validKeys[value]));
      }
    }
  }
  clickPlay(interval: Interval) {
    interval.key = null;
    this.synth.play(interval);
  }
}

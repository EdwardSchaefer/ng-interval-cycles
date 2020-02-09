import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Temperament} from '../temperament-model';
import {Interval} from '../interval-model';
import {SynthService} from '../synth.service';
import {SourceNode} from '../source-node-model';

@Component({
  selector: 'nic-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnChanges {
  @Input() temperament: Temperament;
  matrix: Interval[][] = [];
  constructor(public synth: SynthService) {}
  ngOnChanges() {
    this.matrix = [];
    this.synth.addSourceNodes(this.temperament.value);
    for (let i = 0; i <= this.temperament.value; i++) {
      this.matrix.push([]);
      for (let j = 0; j <= this.temperament.value; j++) {
        const value = (i * j) % this.temperament.value;
        this.matrix[i].push(new Interval(this.temperament.value, value));
      }
    }
  }
  color(value: number) {
    const hue = Math.floor((360 / this.temperament.value * value) % 360);
    const hslString = 'hsl(' + hue + ', 100%, 75%)';
    return {backgroundColor: hslString};
  }
  play(interval: Interval) {
    this.synth.play(interval);
  }
  stop(interval: Interval) {
    this.synth.stop(interval);
  }
}

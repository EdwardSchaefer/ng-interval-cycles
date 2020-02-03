import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Temperament} from '../temperament-model';
import {Interval} from '../interval-model';

@Component({
  selector: 'nic-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnChanges {
  @Input() temperament: Temperament;
  matrix: Interval[][] = [];
  constructor() { }
  ngOnChanges() {
    this.matrix = [];
    for (let i = 0; i <= this.temperament.value; i++) {
      this.matrix.push([]);
      for (let j = 0; j <= this.temperament.value; j++) {
        this.matrix[i].push(new Interval((i * j) % this.temperament.value));
      }
    }
  }
  color(value: number) {
    const hue = Math.floor((360 / this.temperament.value * value) % 360);
    const hslString = 'hsl(' + hue + ', 100%, 75%)';
    return {backgroundColor: hslString};
  }
}

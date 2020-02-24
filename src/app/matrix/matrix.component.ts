import {Component, HostListener, Input, OnChanges, OnInit} from '@angular/core';
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
  matrix: Interval[][] = [];
  osc: OscillatorNode[] = [];
  defaultKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'q', 'w'];
  @HostListener('document: keydown', ['$event'])
  keyPlay(event) {
    const index = this.defaultKeys.indexOf(event.key);
    if (index >= 0) {
      const interval = this.matrix[1][index];
      const osc = this.synth.play(interval);
      this.osc.push(osc);
    }
  }
  @HostListener('document: keyup', ['$event'])
  keyStop(event) {
    const index = this.defaultKeys.indexOf(event.key);
    if (index >= 0) {
      const interval = this.matrix[1][index];
      this.stop(interval);
    }
  }
  constructor(public synth: SynthService) {}
  ngOnChanges() {
    this.matrix = [];
    for (let i = 0; i <= this.temperament.value; i++) {
      this.matrix.push([]);
      for (let j = 0; j <= this.temperament.value; j++) {
        const value = (i * j) % this.temperament.value;
        this.matrix[i].push(new Interval(this.temperament.value, value));
      }
    }
  }
  clickPlay(interval: Interval) {
    const osc = this.synth.play(interval);
    this.osc.push(osc);
  }
  stop(interval: Interval) {
    if (this.osc.length) {
      this.osc.forEach(osc => {
        osc.stop();
        osc.disconnect();
        this.synth.interval.next(null);
      });
      this.osc = [];
    }
  }
}

import {Component, HostListener, Input, OnChanges, OnInit} from '@angular/core';
import {Temperament} from '../temperament-model';
import {Interval} from '../interval-model';
import {SynthService} from '../synth.service';
import {fromEvent} from 'rxjs';
import {take} from 'rxjs/operators';

@Component({
  selector: 'nic-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnChanges {
  @Input() temperament: Temperament;
  matrix: Interval[][] = [];
  clickOsc: OscillatorNode;
  defaultKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'q', 'w'];
  downKeys: string[] = [];
  @HostListener('document: keydown', ['$event'])
  keyPlay(event) {
    const index = this.defaultKeys.indexOf(event.key);
    if (index >= 0 && !this.downKeys.includes(event.key)) {
      this.downKeys.push(event.key);
      const interval = this.matrix[1][index];
      const osc = this.synth.play(interval);
      const keyup = fromEvent(document, 'keyup').pipe(take(1));
      keyup.subscribe(subscriber => {
        this.synth.stop(osc);
        this.downKeys = this.downKeys.filter(key => key !== event.key);
      });
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
    this.clickOsc = this.synth.play(interval);
  }
  stop(interval: Interval) {
    if (this.clickOsc) {
      this.synth.stop(this.clickOsc);
      this.synth.interval.next(null);
    }
  }
}

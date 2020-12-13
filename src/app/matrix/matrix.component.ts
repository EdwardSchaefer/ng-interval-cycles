import {Component, HostListener, Input, OnChanges} from '@angular/core';
import {Temperament} from '../temperament-model';
import {Interval} from '../interval-model';
import {SynthService} from '../synth.service';
import {fromEvent} from 'rxjs';
import {take} from 'rxjs/operators';
import {OscGainController} from '../osc-gain-controller.model';

@Component({
  selector: 'nic-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.css']
})
export class MatrixComponent implements OnChanges {
  @Input() temperament: Temperament;
  // no longer a matrix
  matrix: Interval[] = [];
  clickOsc: OscGainController;
  defaultKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'q', 'w'];
  downKeys: string[] = [];
  matrixContainer: {maxWidth: string, maxHeight: string};
  @HostListener('document: keydown', ['$event'])
  keyPlay(event) {
    const index = this.defaultKeys.indexOf(event.key);
    if (index >= 0 && !this.downKeys.includes(event.key)) {
      this.downKeys.push(event.key);
      const interval = this.matrix[index + this.temperament.value + 1];
      const oscGain = this.synth.play(interval);
      const keyup = fromEvent(document, 'keyup').pipe(take(1));
      keyup.subscribe(subscriber => {
        oscGain.releaseNote();
        this.downKeys = this.downKeys.filter(key => key !== event.key);
      });
    }
  }
  @HostListener('window: resize', ['$event'])
  resize(event: any) {
    console.log(event);
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
  clickPlay(interval: Interval) {
    this.clickOsc = this.synth.play(interval);
  }
  stop(interval: Interval) {
    if (this.clickOsc) {
      this.clickOsc.releaseNote();
      this.synth.interval.next(null);
    }
  }
}

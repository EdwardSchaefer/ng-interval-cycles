import {Component, OnInit} from '@angular/core';
import {Temperament} from '../temperament-model';
import {SynthService} from '../synth.service';

@Component({
  selector: 'nic-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {
  min = 3;
  max = 24;
  temps: Temperament[] = [];
  selectedTemp: Temperament;
  selectedMatrixDisplay: string;
  oscTypes: OscillatorType[] = ['sine', 'square', 'sawtooth', 'triangle'];
  circleTypes: string[] = ['radius', 'chord', 'slice'];
  matrixDisplays = ['value', 'key', 'none'];
  constructor(public synth: SynthService) {
    for (let i = this.min; i <= this.max; i++) {
      this.temps.push(new Temperament(i));
    }
    this.synth.selectedTemp.subscribe(temp => this.selectedTemp = temp);
    this.synth.selectedMatrixDisplay.subscribe(display => this.selectedMatrixDisplay = display);
  }
  ngOnInit() {
    this.synth.selectedTemp.next(this.temps[9]);
    this.synth.selectedMatrixDisplay.next('value');
  }
  selectionChange(event) {
    this.synth.selectedTemp.next(event.value);
  }
  oscChange(event) {
    this.synth.oscType = event.value;
  }
  circleChange(event) {
    this.synth.circleType = event.value;
  }
  matrixDisplayChange(event) {
    this.synth.selectedMatrixDisplay.next(event.value);
  }
}

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
  constructor(public synth: SynthService) {
    for (let i = this.min; i <= this.max; i++) {
      this.temps.push(new Temperament(i));
    }
    this.synth.selectedTemp.subscribe(temp => this.selectedTemp = temp);
  }
  ngOnInit() {
    this.synth.selectedTemp.next(this.temps[9]);
  }
  selectionChange(event) {
    this.synth.selectedTemp.next(event.value);
  }
}

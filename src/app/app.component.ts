import {Component} from '@angular/core';
import {Temperament} from './temperament-model';
import {SynthService} from './synth.service';

@Component({
  selector: 'nic-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  min = 3;
  max = 24;
  temps: Temperament[] = [];
  selectedTemp: Temperament;
  constructor(public synth: SynthService) {
    for (let i = this.min; i <= this.max; i++) {
      this.temps.push(new Temperament(i));
    }
    this.selectedTemp = this.temps[9];
  }
}

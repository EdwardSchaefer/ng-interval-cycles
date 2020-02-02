import { Component } from '@angular/core';
import {Temperament} from './temperaments-model';

@Component({
  selector: 'nic-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-interval-cycles';
  min = 3;
  max = 24;
  temps: Temperament[] = [];
  selectedTemp: Temperament;
  constructor() {
    for (let i = this.min; i <= this.max; i++) {
      this.temps.push(new Temperament(i));
    }
    this.selectedTemp = this.temps[9];
  }
}

import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {SynthService} from '../synth.service';
import {Radius} from '../radius-model';

@Component({
  selector: 'nic-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.css']
})
export class CircleComponent implements AfterViewInit {
  @ViewChild('svgElement', {static: true}) svgElement: ElementRef;
  radiusLine: Radius;
  size = 400;
  radius = this.size / 2;
  strokeWidth = 1;
  constructor(public synth: SynthService) {
    this.synth.interval.subscribe(interval => {
      if (interval) {
        this.radiusLine = new Radius(interval, this.radius);
      } else {
        this.radiusLine = null;
      }
    });
  }
  ngAfterViewInit(): void {

  }
}

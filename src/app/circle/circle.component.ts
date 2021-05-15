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
  size = 300;
  radius = this.size / 2;
  strokeWidth = 1;
  constructor(public synth: SynthService) {
    this.synth.note.subscribe(note => {
      this.radiusLine = new Radius(note.interval, this.radius);
      this.synth.amplitude.subscribe(amp => {
        if (this.radiusLine) {
          this.radiusLine.opacity = amp;
        }
      });
    });
  }
  ngAfterViewInit(): void {

  }
}

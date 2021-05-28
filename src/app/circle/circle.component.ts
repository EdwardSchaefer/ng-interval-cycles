import {Component, ElementRef, ViewChild} from '@angular/core';
import {SynthService} from '../synth.service';
import {Radius} from '../radius-model';

@Component({
  selector: 'nic-circle',
  templateUrl: './circle.component.html',
  styleUrls: ['./circle.component.css']
})
export class CircleComponent {
  @ViewChild('svgElement', {static: true}) svgElement: ElementRef;
  radiusLines: Radius[] = [];
  size = 300;
  radius = this.size / 2;
  strokeWidth = 1;
  constructor(public synth: SynthService) {
    this.synth.note.subscribe(note => {
      const radiusLine = new Radius(note, this.radius, this.synth.circleType);
      this.radiusLines.push(radiusLine);
      note.stopped.subscribe(stopped => {
        if (stopped) {
          this.radiusLines = this.radiusLines.filter(line => line !== radiusLine);
        }
      });
    });
  }
}

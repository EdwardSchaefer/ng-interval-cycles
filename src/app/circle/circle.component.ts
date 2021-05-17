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
  radiusLines: Radius[] = [];
  size = 300;
  radius = this.size / 2;
  strokeWidth = 1;
  constructor(public synth: SynthService) {
    this.synth.note.subscribe(note => {
      const radiusLine = new Radius(note, this.radius);
      this.radiusLines.push(radiusLine);
      note.stopped.subscribe(stopped => {
        if (stopped) {
          this.radiusLines = this.radiusLines.filter(line => line !== radiusLine);
        }
      });
    });
  }
  ngAfterViewInit(): void {
    this.draw();
  }
  draw() {
    const timesReducer = (acc, curr) => Math.abs(curr - 128) > acc ? Math.abs(curr - 128) : acc;
    this.radiusLines.forEach(line => {
      const times = new Uint8Array(line.noteAnalyser.frequencyBinCount);
      line.noteAnalyser.getByteTimeDomainData(times);
      line.opacity = times.reduce(timesReducer, 0) / 128;
    });
    requestAnimationFrame(this.draw.bind(this));
  }
}

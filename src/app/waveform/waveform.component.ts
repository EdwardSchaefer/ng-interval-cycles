import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {SynthService} from '../synth.service';

@Component({
  selector: 'nic-waveform',
  templateUrl: './waveform.component.html',
  styleUrls: ['./waveform.component.css']
})
export class WaveformComponent implements AfterViewInit {
  @ViewChild('waveform', {static: true}) waveform: ElementRef;
  canvas;
  canvasContext;
  height = 300;
  width = 600;
  constructor(public synth: SynthService) { }
  ngAfterViewInit(): void {
    this.canvas = this.waveform.nativeElement;
    this.canvasContext = this.canvas.getContext('2d');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.draw();
  }
  draw() {
    if (this.synth.initialized) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      const times = new Uint8Array(this.synth.analyser.frequencyBinCount);
      this.synth.analyser.getByteTimeDomainData(times);
      for (let i = 0; i < times.length; i++) {
        const value = times[i];
        const percent = value / 256;
        const height = this.height * percent;
        const offset = this.height - height - 1;
        const barWidth = this.width / times.length;
        this.canvasContext.fillStyle = 'black';
        this.canvasContext.fillRect(i * barWidth, offset, 1, 1);
      }
    }
    requestAnimationFrame(this.draw.bind(this));
  }
}

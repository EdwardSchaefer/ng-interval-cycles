import {Component} from '@angular/core';

@Component({
  selector: 'nic-envelope',
  templateUrl: './envelope.component.html',
  styleUrls: ['./envelope.component.css']
})
export class EnvelopeComponent {
  envelope: Envelope;
  lineCount = 4;
  height = 200;
  width = this.height * this.lineCount;
  constructor() {
    this.envelope = new Envelope(4);
  }
  update(event, handle: Handle) {
    handle.cx = event.event.offsetX;
    handle.cy = event.event.offsetY;
  }
}

class Envelope {
  handles: Handle[] = [];
  constructor(lines: number) {
    const handleCount = lines * 2;
    this.handles.push(new Handle(0));
    for (let i = 0; i < handleCount; i++) {
      this.handles.push(new Handle(i + 1));
    }
  }
  get path(): string {
    let result = 'M 0 0 ';
    this.handles.forEach(handle => {
      result = result + 'H ' + handle.cx + ' V ' + handle.cy + ' ';
    });
    return result + 'Z';
  }
}


class Handle {
  radius = 10;
  index: number;
  initX: number;
  initY: number;
  cx: number;
  cy: number;
  constructor(i: number) {
    this.index = i;
    this.initX = 100 * i;
    this.initY = 100;
    this.cx = 100 * i;
    this.cy = 100;
  }
}

import {Component} from '@angular/core';

@Component({
  selector: 'nic-envelope',
  templateUrl: './envelope.component.html',
  styleUrls: ['./envelope.component.css']
})
export class EnvelopeComponent {
  envelope: Envelope;
  nodeCount = 7;
  height = 200;
  width = this.height * this.nodeCount / 2;
  constructor() {
    this.envelope = new Envelope(this.nodeCount);
  }
  update(event, handle: Handle) {
    const transform: string = event.source.element.nativeElement.style.transform;
    const coords = transform.substring(12).split(',');
    handle.cx = parseInt(coords[0].split('px')[0], 10) + handle.initX;
    handle.cy = parseInt(coords[1].split('px')[0], 10) + handle.initY;
  }
}

class Envelope {
  handles: Handle[] = [];
  constructor(nodes: number) {
    for (let i = 0; i < nodes; i++) {
      this.handles.push(new Handle(i));
    }
  }
  get path(): string {
    let result = '';
    this.handles.forEach((handle, index) => {
      if (!index) {
        result = result + 'M ' + handle.cx + ' ' + handle.cy + ' ';
      }
      if (index % 2) {
        result = result + 'Q ' + handle.cx + ' ' + handle.cy + ' ';
      } else {
        result = result + handle.cx + ' ' + handle.cy + ' ';
      }

    });
    return result;
  }
}

class Handle {
  radius: number;
  fill: string;
  index: number;
  initX: number;
  initY: number;
  cx: number;
  cy: number;
  lockAxis: string;
  dragBoundary: string;
  constructor(i: number) {
    this.index = i;
    this.initX = 100 * i;
    this.initY = 100;
    this.cx = 100 * i;
    this.cy = 100;
    this.radius = i % 2 ? 5 : 10;
    this.fill = i % 2 ? 'grey' : 'black';
    this.lockAxis = i % 2 ? '' : 'y';
    this.dragBoundary = '.svg-container';
  }
}

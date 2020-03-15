import {Component} from '@angular/core';
import {SynthService} from '../synth.service';
import {Vector} from '../vector-model';
import {VerticalHandle, BezierHandle} from '../handle-model';

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
  constructor(public synth: SynthService) {
    this.envelope = new Envelope(this.nodeCount, this.height);
  }
  update(event, handle: (VerticalHandle | BezierHandle)) {
    const transform: string = event.source.element.nativeElement.style.transform;
    const coords = transform.substring(12).split(',');
    handle.coord.x = parseInt(coords[0].split('px')[0], 10) + handle.initX;
    handle.coord.y = parseInt(coords[1].split('px')[0], 10) + handle.initY;
    const handles = this.envelope.handles.map(envHandle => new Vector(envHandle.coord.x, envHandle.coord.y));
    this.synth.curve.next(handles);
  }
}

class Envelope {
  handles: (VerticalHandle[] | BezierHandle[]) = [];
  height: number;
  constructor(nodes: number, height: number) {
    this.height = height;
    for (let i = 0; i < nodes; i++) {
      this.handles.push(i % 2 ? new BezierHandle(i) : new VerticalHandle(i));
    }
  }
  get path(): string {
    let result = '';
    this.handles.forEach((handle, index) => {
      let svgCommand = 'M';
      if (index) {
        svgCommand = index % 2 ? 'Q' : '';
      }
      result = result + svgCommand + handle.coordString;
    });
    return result;
  }
}

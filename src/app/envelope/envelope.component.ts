import {Component} from '@angular/core';
import {SynthService} from '../synth.service';
import {VerticalHandle, BezierHandle} from '../data-models/handle-model';
import {Note} from '../data-models/note.model';
import {Envelope} from '../data-models/envelope-model';

@Component({
  selector: 'nic-envelope',
  templateUrl: './envelope.component.html',
  styleUrls: ['./envelope.component.css']
})
export class EnvelopeComponent {
  envelope: Envelope;
  nodeCount = 7;
  offsetRadius = 10;
  height = 200;
  width = (this.height * this.nodeCount / 2) - ((this.height / 2) - this.offsetRadius * 2);
  debugX = 0;
  notes: Note[] = [];
  constructor(public synth: SynthService) {
    this.envelope = new Envelope(this.nodeCount, this.height, this.offsetRadius);
    const curve = this.envelope.getCurve();
    this.synth.curve.next(curve);
    this.synth.note.subscribe(note => {
      this.notes.push(note);
      note.stopped.subscribe(stopped => {
        if (stopped) {
          this.notes = this.notes.filter(n => n !== note);
        }
      });
    });
  }
  update(event, handle: (VerticalHandle | BezierHandle)) {
    const transform: string = event.source.element.nativeElement.style.transform;
    const coords = transform.substring(12).split(',');
    handle.coord.x = parseInt(coords[0].split('px')[0], 10) + handle.initX;
    handle.coord.y = parseInt(coords[1].split('px')[0], 10) + handle.initY;
    const curve = this.envelope.getCurve();
    this.synth.curve.next(curve);
  }
  debug(event) {
    this.debugX = event.x;
  }
}

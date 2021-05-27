import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatrixComponent } from './matrix/matrix.component';
import { WaveformComponent } from './waveform/waveform.component';
import { CircleComponent } from './circle/circle.component';
import { EnvelopeComponent } from './envelope/envelope.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ControlsComponent} from "./controls/controls.component";

@NgModule({
  declarations: [
    AppComponent,
    MatrixComponent,
    WaveformComponent,
    CircleComponent,
    EnvelopeComponent,
    ControlsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSelectModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

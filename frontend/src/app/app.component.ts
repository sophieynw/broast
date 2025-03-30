import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BearComponent } from './bear/bear.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BearComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
}

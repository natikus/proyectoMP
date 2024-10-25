import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NbLayoutModule } from '@nebular/theme';
import { BrowserModule } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NbLayoutModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'frontend';
}

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LibToastComponent } from './components/libs/lib-toast/lib-toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LibToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('HRM-FrontEnd-2026');
}

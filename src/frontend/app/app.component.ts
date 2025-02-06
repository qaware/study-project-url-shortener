import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  template: `
    <h1>URL Shortener</h1>
    <!-- Required for redirect to actual component -->
    <router-outlet />
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
}

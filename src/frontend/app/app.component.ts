import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NGXLogger } from 'ngx-logger';
import { ShortenStatus } from './model/status.model';
import { UrlShortenerService } from './url-shortener.service';
import { StatusComponent } from './components/status/status.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatProgressSpinnerModule,
    RouterOutlet
  ],
  template: `
    <!-- Required for redirect to actual url -->
    <router-outlet />
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
}

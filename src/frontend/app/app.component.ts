import { Component } from '@angular/core';
import { UrlShortenerService } from './url-shortener.service';

@Component({
  selector: 'app-root',
  template: `
    <!-- <div style="text-align:center">
      <h1>URL Shortener</h1>
      <input type="text" [(ngModel)]="url" placeholder="Enter URL" />
      <button (click)="shorten()">Shorten URL</button>
      <div *ngIf="shortCode">
        Short URL:
        <a [href]="'http://localhost:8000/' + shortCode" target="_blank">
          http://localhost:8000/{{ shortCode }}
        </a>
      </div>
      <div *ngIf="errorMessage" style="color:red;">
        {{ errorMessage }}
      </div>
    </div> -->
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  url: string = '';
  shortCode: string | null = null;
  errorMessage: string | null = null;

  constructor(private urlShortenerService: UrlShortenerService) {}

  shorten() {
    this.urlShortenerService.shortenUrl(this.url).subscribe({
      next: (response) => {
        this.shortCode = response.short_code;
        this.errorMessage = null;
      },
      error: () => {
        this.errorMessage = 'Error shortening URL';
        this.shortCode = null;
      },
    });
  }
}

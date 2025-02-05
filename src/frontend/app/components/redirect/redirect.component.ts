import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { UrlShortenerService } from '../../url-shortener.service';

@Component({
  selector: 'app-redirect',
  standalone: true,
  template: `
    @if(errorMessage()) {
    <p>{{ errorMessage() }}</p>
    <a routerLink="/">Go Home</a>
    } @else {
    <p>Redirecting...</p>
    }
  `,
})
export class RedirectComponent implements OnInit {
  protected readonly errorMessage = signal<string | undefined>(undefined);
  private readonly route = inject(ActivatedRoute);
  private readonly urlShortenerService = inject(UrlShortenerService);
  private readonly logger = inject(NGXLogger);

  async ngOnInit(): Promise<void> {
    this.logger.debug('Redirecting...');
    this.route.paramMap.subscribe(async (params) => {
      const shortCode = params.get('shortcode');
      if (!shortCode) {
        this.errorMessage.set('Invalid short URL');
        return;
      }
      try {
        const result = await this.urlShortenerService.getLongUrl(shortCode);
        window.location.href = result.long_url;
      } catch (error) {
        this.logger.error('Failed to fetch long URL:', error);
        this.errorMessage.set('Short URL not found.');
      }
    });
  }
}

import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ShortenStatus } from '../../model/status.model';
import { StatisticsService } from '../../statistics.service';
import { UrlShortenerService } from '../../url-shortener.service';
import { UrlShortenerComponent } from './url-shortener.component';

@Component({
  selector: 'app-url-shortener-container',
  standalone: true,
  imports: [UrlShortenerComponent],
  template: `
    <app-url-shortener
      [url]="url()"
      [shortPath]="shortPath()"
      [errorMessage]="errorMessage()"
      [shorteningUrlInProgress]="shorteningUrlInProgress()"
      [status]="status()"
      [isStatsAvailable]="isStatsAvailable()"
      [totalUrls]="totalUrls()"
      [totalClicks]="totalClicks()"
      (urlChanged)="onUrlChanged($event)"
      (shortenRequested)="onShortenRequested()"
    />
  `
})
export class UrlShortenerContainer implements OnInit, OnDestroy {
  protected readonly url = signal<string | undefined>(undefined);
  protected readonly shortPath = signal<string | undefined>(undefined);
  protected readonly errorMessage = signal<string | undefined>(undefined);
  protected readonly shorteningUrlInProgress = signal(false);
  protected readonly status = signal<ShortenStatus | undefined>(undefined);
  protected readonly isStatsAvailable = signal(false);
  protected readonly totalUrls = signal(0);
  protected readonly totalClicks = signal(0);

  private readonly logger = inject(NGXLogger);
  private readonly urlShortenerService = inject(UrlShortenerService);
  private readonly statisticsService = inject(StatisticsService);

  private statsRefreshInterval: number | undefined;
  private readonly STATS_REFRESH_INTERVAL_MS = 1000; // 1 second

  async ngOnInit() {
    await this.checkStatsFeature();
  }

  ngOnDestroy() {
    this.stopStatsAutoRefresh();
  }

  protected onUrlChanged(url: string | undefined) {
    this.url.set(url);
  }

  protected async onShortenRequested() {
    await this.shorten();
  }

  private async checkStatsFeature() {
    try {
      this.logger.debug('Checking stats feature availability...');
      const available = await this.statisticsService.isStatsFeatureAvailable();
      this.logger.debug('Stats feature available:', available);
      this.isStatsAvailable.set(available);
      
      if (available) {
        this.logger.debug('Loading initial quick stats...');
        await this.loadQuickStats();
        this.startStatsAutoRefresh();
      }
    } catch (error) {
      this.logger.debug('Stats feature not available', error);
      this.isStatsAvailable.set(false);
    }
  }

  private startStatsAutoRefresh() {
    // Clear any existing interval
    this.stopStatsAutoRefresh();
    
    this.statsRefreshInterval = window.setInterval(async () => {
      try {
        if (this.isStatsAvailable()) {
          await this.loadQuickStatsQuietly();
        }
      } catch (error) {
        this.logger.debug('Stats auto-refresh failed, continuing silently:', error);
      }
    }, this.STATS_REFRESH_INTERVAL_MS);
    
    this.logger.debug('Started auto-refresh for quick stats');
  }

  private stopStatsAutoRefresh() {
    if (this.statsRefreshInterval) {
      clearInterval(this.statsRefreshInterval);
      this.statsRefreshInterval = undefined;
      this.logger.debug('Stopped auto-refresh for quick stats');
    }
  }

  private async loadQuickStats() {
    try {
      const stats = await this.statisticsService.getAllStats();
      this.totalUrls.set(stats.length);
      const totalClicks = stats.reduce((sum, stat) => sum + stat.click_count, 0);
      this.totalClicks.set(totalClicks);
    } catch (error) {
      this.logger.debug('Could not load quick stats');
    }
  }

  private async loadQuickStatsQuietly() {
    // Load stats without logging errors for auto-refresh
    try {
      const stats = await this.statisticsService.getAllStats();
      this.totalUrls.set(stats.length);
      const totalClicks = stats.reduce((sum, stat) => sum + stat.click_count, 0);
      this.totalClicks.set(totalClicks);
    } catch (error) {
      // Silent failure for background updates
      this.logger.debug('Quiet stats refresh failed:', error);
    }
  }

  private async shorten() {
    this.shortPath.set(undefined);

    if (this.shorteningUrlInProgress()) {
      this.logger.info(
        'Shortening URL is already in progress. Not starting another request.'
      );
      return;
    }

    const url = this.url();
    if (!url) {
      this.logger.warn('URL is empty');
      this.status.set(ShortenStatus.MISSING_URL);
      return;
    }
    await this.shortenUrl(url);
  }

  private async shortenUrl(url: string) {
    this.shorteningUrlInProgress.set(true);
    try {
      const shortPath = await this.urlShortenerService.shortenUrl(url);

      // Make sure that the short path is not empty
      if (!shortPath) {
        throw {
          error: {
            detail: 'The returned short path is empty',
          },
        };
      }

      this.shortPath.set(shortPath);
      // Keep the URL so QR code remains visible for the latest entered value
      // this.url.set(undefined);
      this.status.set(ShortenStatus.REQUEST_SUCCESS);

      // Refresh stats if available - force refresh after successful creation
      if (this.isStatsAvailable()) {
        // Wait a bit for backend to update, then refresh
        setTimeout(async () => {
          await this.loadQuickStats();
        }, 100);
      }

      return shortPath;
    } catch (error) {
      this.logger.error('Failed to shorten URL', error);
      this.status.set(ShortenStatus.REQUST_FAILURE);
      this.extractAndSetErrorMessage(error);
      return undefined;
    } finally {
      this.shorteningUrlInProgress.set(false);
    }
  }

  private extractAndSetErrorMessage(error: unknown) {
    if (error && typeof error === 'object' && 'error' in error) {
      const httpError = error as { error?: { detail?: string } };
      const detail = httpError.error?.detail || 'An unexpected error occurred';
      this.errorMessage.set(detail);
    } else {
      this.errorMessage.set('An unexpected error occurred');
    }
  }
}

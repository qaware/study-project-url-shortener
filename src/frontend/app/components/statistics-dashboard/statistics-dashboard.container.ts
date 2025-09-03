import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ClickStats, StatisticsService } from '../../statistics.service';
import { StatisticsDashboardComponent } from './statistics-dashboard.component';

@Component({
  selector: 'app-statistics-dashboard-container',
  standalone: true,
  imports: [StatisticsDashboardComponent],
  template: `
    <app-statistics-dashboard
      [isStatsAvailable]="isStatsAvailable()"
      [stats]="stats()"
      [loading]="loading()"
    />
  `
})
export class StatisticsDashboardContainer implements OnInit, OnDestroy {
  private readonly statisticsService = inject(StatisticsService);
  private readonly logger = inject(NGXLogger);

  protected readonly isStatsAvailable = signal(false);
  protected readonly stats = signal<ClickStats[]>([]);
  protected readonly loading = signal(false);

  private refreshInterval: number | undefined;
  private readonly REFRESH_INTERVAL_MS = 1000; // 1 second

  async ngOnInit() {
    await this.checkStatsAvailability();
    if (this.isStatsAvailable()) {
      await this.loadStats();
      this.startAutoRefresh();
    }
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  private startAutoRefresh() {
    // Clear any existing interval
    this.stopAutoRefresh();
    
    this.refreshInterval = window.setInterval(async () => {
      try {
        if (this.isStatsAvailable()) {
          await this.loadStatsQuietly();
        }
      } catch (error) {
        this.logger.debug('Auto-refresh failed, continuing silently:', error);
      }
    }, this.REFRESH_INTERVAL_MS);
    
    this.logger.info('Started auto-refresh for statistics');
  }

  private stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = undefined;
      this.logger.info('Stopped auto-refresh for statistics');
    }
  }

  private async checkStatsAvailability() {
    try {
      const available = await this.statisticsService.isStatsFeatureAvailable();
      this.isStatsAvailable.set(available);
    } catch (error) {
      this.logger.error('Error checking stats availability:', error);
      this.isStatsAvailable.set(false);
    }
  }

  private async loadStats() {
    this.loading.set(true);
    try {
      const stats = await this.statisticsService.getAllStats();
      this.stats.set(stats);
    } catch (error) {
      this.logger.error('Error loading statistics:', error);
    } finally {
      this.loading.set(false);
    }
  }

  private async loadStatsQuietly() {
    // Load stats without showing loading spinner for auto-refresh
    try {
      const stats = await this.statisticsService.getAllStats();
      this.stats.set(stats);
    } catch (error) {
      this.logger.debug('Quiet stats refresh failed:', error);
      // Don't show error to user, just log it
    }
  }
}

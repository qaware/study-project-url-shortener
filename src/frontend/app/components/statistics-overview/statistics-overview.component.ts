import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ClickStats } from '../../statistics.service';

@Component({
  selector: 'app-statistics-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overview">
      <div class="stat-item">
        <h3>{{ stats().length }}</h3>
        <p>Total URLs</p>
      </div>
      <div class="stat-item">
        <h3>{{ getTotalClicks() }}</h3>
        <p>Total Clicks</p>
      </div>
      <div class="stat-item">
        <h3>{{ getMostPopularUrl()?.short_code || 'N/A' }}</h3>
        <p>Most Popular</p>
      </div>
    </div>
  `,
  styleUrls: ['./statistics-overview.component.scss']
})
export class StatisticsOverviewComponent {
  readonly stats = input<ClickStats[]>([]);

  protected getTotalClicks(): number {
    return this.stats().reduce((total, stat) => total + stat.click_count, 0);
  }

  protected getMostPopularUrl(): ClickStats | undefined {
    const stats = this.stats();
    if (stats.length === 0) return undefined;
    
    return stats.reduce((most, current) => 
      current.click_count > most.click_count ? current : most
    );
  }
}

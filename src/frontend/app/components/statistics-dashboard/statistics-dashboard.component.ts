import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClickStats } from '../../statistics.service';
import { ClickChartComponent } from '../click-chart/click-chart.component';
import { StatisticsOverviewComponent } from '../statistics-overview/statistics-overview.component';
import { StatisticsTableComponent } from '../statistics-table/statistics-table.component';

@Component({
  selector: 'app-statistics-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ClickChartComponent,
    StatisticsOverviewComponent,
    StatisticsTableComponent
  ],
  template: `
    @if (isStatsAvailable()) {
      <mat-card class="stats-card">
        <mat-card-header>
          <mat-card-title>URL Statistics Dashboard</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          @if (loading()) {
            <div class="loading-container">
              <mat-progress-spinner mode="indeterminate" diameter="40"></mat-progress-spinner>
              <p>Loading statistics...</p>
            </div>
          } @else if (stats().length === 0) {
            <p class="no-data">No shortened URLs found yet. Create some URLs to see statistics!</p>
          } @else {
            <div class="stats-content">
              <app-statistics-overview [stats]="stats()"></app-statistics-overview>
              <app-click-chart [stats]="stats()"></app-click-chart>
              <app-statistics-table [stats]="stats()"></app-statistics-table>
            </div>
          }
        </mat-card-content>
      </mat-card>
    }
  `,
  styleUrls: ['./statistics-dashboard.component.scss'],
})
export class StatisticsDashboardComponent {
  readonly isStatsAvailable = input<boolean>(false);
  readonly stats = input<ClickStats[]>([]);
  readonly loading = input<boolean>(false);
}

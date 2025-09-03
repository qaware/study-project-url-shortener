import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { StatisticsService } from './statistics.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>URL Shortener</span>
      <span class="spacer"></span>
      <a mat-button routerLink="/">
        <mat-icon>home</mat-icon>
        Home
      </a>
      @if (isStatsAvailable()) {
        <a mat-button routerLink="/stats">
          <mat-icon>bar_chart</mat-icon>
          Statistics
        </a>
      }
    </mat-toolbar>
    
    <div class="content">
      <router-outlet />
    </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly statisticsService = inject(StatisticsService);
  protected readonly isStatsAvailable = signal(false);

  async ngOnInit() {
    const available = await this.statisticsService.isStatsFeatureAvailable();
    this.isStatsAvailable.set(available);
  }
}

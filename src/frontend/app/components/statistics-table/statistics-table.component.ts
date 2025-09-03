import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ClickStats } from '../../statistics.service';

@Component({
  selector: 'app-statistics-table',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  template: `
    <table mat-table [dataSource]="stats()" class="stats-table">
      <ng-container matColumnDef="shortCode">
        <th mat-header-cell *matHeaderCellDef>Short Code</th>
        <td mat-cell *matCellDef="let stat" class="short-code-cell">
          <a [href]="getShortUrl(stat.short_code)" target="_blank" [title]="'Click to visit: ' + getShortUrl(stat.short_code)">{{ stat.short_code }}</a>
        </td>
      </ng-container>

      <ng-container matColumnDef="originalUrl">
        <th mat-header-cell *matHeaderCellDef>Original URL</th>
        <td mat-cell *matCellDef="let stat" class="url-cell">
          <a [href]="ensureProtocol(stat.original_url)" target="_blank" [title]="stat.original_url">{{ truncateUrl(stat.original_url) }}</a>
        </td>
      </ng-container>

      <ng-container matColumnDef="clickCount">
        <th mat-header-cell *matHeaderCellDef>Clicks</th>
        <td mat-cell *matCellDef="let stat">
          <span class="click-count">{{ stat.click_count }}</span>
        </td>
      </ng-container>

      <ng-container matColumnDef="createdAt">
        <th mat-header-cell *matHeaderCellDef>Created</th>
        <td mat-cell *matCellDef="let stat">{{ formatDate(stat.created_at) }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styleUrls: ['./statistics-table.component.scss']
})
export class StatisticsTableComponent {
  readonly stats = input<ClickStats[]>([]);
  protected readonly displayedColumns = ['shortCode', 'originalUrl', 'clickCount', 'createdAt'];

  protected truncateUrl(url: string): string {
    return url.length > 50 ? url.substring(0, 50) + '...' : url;
  }

  protected ensureProtocol(url: string): string {
    if (url.match(/^https?:\/\//)) {
      return url;
    }
    if (url.startsWith('www.')) {
      return `https://${url}`;
    }
    return `https://${url}`;
  }

  protected getShortUrl(shortCode: string): string {
    const baseUrl = window.location.origin;
    return `${baseUrl}/${shortCode}`;
  }

  protected formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}

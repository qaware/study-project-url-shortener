import { Component, input } from '@angular/core';
import { ShortenStatus } from '../../model/status.model';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [
  ],
  template: `
      @if (status() === RequestStatus.MISSING_URL) {
      <div class="warning">Please enter an URL</div>

      } @else if (status() === RequestStatus.REQUST_FAILURE) {
      <div class="error">Failed to shorten URL</div>
      }
  `,
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent {
    readonly status = input.required<ShortenStatus | undefined>();

  protected readonly RequestStatus = ShortenStatus;
}

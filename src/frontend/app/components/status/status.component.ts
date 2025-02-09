import { Component, computed, input } from '@angular/core';
import { ShortenStatus } from '../../model/status.model';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [],
  template: `
    @if (status() === RequestStatus.MISSING_URL) {
    <div class="warning">Please enter an URL</div>

    } @else if (status() === RequestStatus.REQUST_FAILURE) {
    <div class="error">{{computeRequestFailureMessage()}}</div>
    }
  `,
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent {
  readonly status = input.required<ShortenStatus | undefined>();
  readonly errorMessage = input<string | undefined>();

  protected readonly computeRequestFailureMessage = computed(() => {
    let failureMessage = 'Failed to shorten URL';

    if (this.errorMessage()) {
      failureMessage += ': ' + this.errorMessage();
    }
    return failureMessage;
  }
  );
  protected readonly RequestStatus = ShortenStatus;
}

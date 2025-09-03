import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-redirect',
  standalone: true,
  imports: [MatProgressSpinnerModule, MatButtonModule],
  template: `
    @if(errorMessage()) {
      <p class="error">{{ errorMessage() }}</p>
      <button mat-raised-button (click)="onGoHomeRequested()" color="primary">
        Go Home
      </button>
    } @else if (isRedirecting()) {
      <h3>
        Redirecting... <mat-progress-spinner mode="indeterminate" diameter="20" />
      </h3>
    }
  `,
  styleUrls: ['./redirect.component.scss'],
})
export class RedirectComponent {
  readonly errorMessage = input<string | undefined>();
  readonly isRedirecting = input<boolean>(true);
  
  readonly goHomeRequested = output<void>();

  protected onGoHomeRequested() {
    this.goHomeRequested.emit();
  }
}

import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RedirectComponent } from './components/redirect/redirect.component';

export const routes: Routes = [
    { path: '', component: AppComponent },
    { path: ':shortcode', component: RedirectComponent },
];
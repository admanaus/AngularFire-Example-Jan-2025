import { Component, signal, inject, effect } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbar,
    MatButtonModule,
    MatMenuModule,
    MatIconModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angularfire-example');
  public readonly authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    // Handle navigation based on authentication state changes
    effect(() => {
      const user = this.authService.currentUser();
      const currentUrl = this.router.url;
      
      console.log('Auth state changed:', { user: !!user, currentUrl });
      
      if (user && (currentUrl === '/auth/signin' || currentUrl === '/')) {
        // User is authenticated but on sign-in page or root, redirect to main app
        console.log('Redirecting authenticated user to /company/all');
        this.router.navigate(['/company/all']);
      } else if (!user && !currentUrl.startsWith('/auth/')) {
        // User is not authenticated and not on auth page, redirect to sign-in
        console.log('Redirecting unauthenticated user to /auth/signin');
        this.router.navigate(['/auth/signin']);
      }
    });
  }
}

// src/app/auth/signin/signin.ts
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule
  ],
  template: `
    <div class="auth-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Sign In</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="signInForm" (ngSubmit)="onSignIn()">
            <mat-form-field>
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email">
            </mat-form-field>
            
            <mat-form-field>
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password">
            </mat-form-field>
            
            @if (errorMessage()) {
              <div class="error">{{ errorMessage() }}</div>
            }
            
            <div class="button-group">
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="signInForm.invalid || isLoading()">
                Sign In
              </button>
              
              <button mat-raised-button type="button" 
                      (click)="onSignUp()" [disabled]="isLoading()">
                Sign Up
              </button>
            </div>
          </form>
          
          <mat-divider></mat-divider>
          
          <button mat-raised-button color="accent" 
                  (click)="onGoogleSignIn()" [disabled]="isLoading()">
            Sign in with Google
          </button>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
    }
    
    mat-card {
      width: 400px;
      padding: 20px;
    }
    
    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .button-group {
      display: flex;
      gap: 16px;
      margin: 16px 0;
    }
    
    .error {
      color: red;
      margin: 16px 0;
    }
    
    mat-divider {
      margin: 20px 0;
    }
  `]
})
export class SignIn {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  errorMessage = signal('');
  isLoading = signal(false);
  
  signInForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async onSignIn() {
    if (this.signInForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      
      try {
        const { email, password } = this.signInForm.value;
        await this.authService.signInWithEmail(email!, password!);
      } catch (error: any) {
        this.errorMessage.set(error.message || 'Sign in failed');
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  async onSignUp() {
    if (this.signInForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      
      try {
        const { email, password } = this.signInForm.value;
        await this.authService.signUpWithEmail(email!, password!);
      } catch (error: any) {
        this.errorMessage.set(error.message || 'Sign up failed');
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  async onGoogleSignIn() {
    this.isLoading.set(true);
    try {
      await this.authService.signInWithGoogle();
    } catch (error) {
      this.errorMessage.set('Google sign-in failed');
    } finally {
      this.isLoading.set(false);
    }
  }
}

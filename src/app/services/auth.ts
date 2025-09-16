// src/app/services/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import {
  Auth, user, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, GoogleAuthProvider, signInWithPopup,
  User
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  user$ = user(this.auth);
  currentUser = signal<User | null>(null);

  constructor() {
    this.user$.subscribe(user => {
      console.log('Auth state change:', { user: !!user, email: user?.email });
      this.currentUser.set(user);
    });
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      console.log('Initiating Google sign-in popup...');
      
      // Use popup method which is more reliable for sessionStorage
      const result = await signInWithPopup(this.auth, provider);
      console.log('Google sign-in successful:', result.user.email);
      
      // Navigation will be handled by app component effect
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      // Provide user-friendly error messages
      if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup was blocked by browser. Please allow popups for this site and try again.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in was cancelled. Please try again.');
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error('This domain is not authorized for Google sign-in.');
      } else {
        throw new Error('Google sign-in failed. Please try again.');
      }
    }
  }

  async signInWithEmail(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      // Navigation handled by app component
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  }

  async signUpWithEmail(email: string, password: string) {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      // Navigation handled by app component
    } catch (error) {
      console.error('Email sign-up error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await signOut(this.auth);
      // Navigation handled by app component
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }
}

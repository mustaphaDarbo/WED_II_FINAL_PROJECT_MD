import { Component } from '@angular/core';
import { DatabaseService, User } from './database.service';

@Component({
  selector: 'app-login',
  template: `
    <div style="background: white; padding: clamp(20px, 5vw, 30px); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 30px; max-width: clamp(300px, 80vw, 400px); margin: 0 auto;">
      <h2 style="color: #2c3e50; text-align: center; margin: 0 0 clamp(20px, 5vw, 30px) 0; font-size: clamp(1.5rem, 4vw, 2rem);">🔐 Login to UCUMS</h2>
      
      <div *ngIf="loginMessage" [style]="loginMessageStyle" style="padding: 15px; border-radius: 6px; margin-bottom: 20px; text-align: center; font-size: clamp(0.9rem, 2.5vw, 1rem);">
        <p [innerHTML]="loginMessage"></p>
      </div>
      
      <form (ngSubmit)="login()">
        <div style="margin-bottom: clamp(15px, 4vw, 20px);">
          <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 500; font-size: clamp(0.9rem, 2.5vw, 1rem);">📧 Email:</label>
          <input type="email" [(ngModel)]="email" name="email" style="width: 100%; padding: clamp(10px, 3vw, 12px); border: 2px solid #ddd; border-radius: 6px; font-size: clamp(0.9rem, 2.5vw, 1rem);" placeholder="Enter your email" required>
        </div>
        
        <div style="margin-bottom: clamp(20px, 5vw, 25px);">
          <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 500; font-size: clamp(0.9rem, 2.5vw, 1rem);">🔒 Password:</label>
          <input type="password" [(ngModel)]="password" name="password" style="width: 100%; padding: clamp(10px, 3vw, 12px); border: 2px solid #ddd; border-radius: 6px; font-size: clamp(0.9rem, 2.5vw, 1rem);" placeholder="Enter your password" required>
        </div>
        
        <button type="submit" [disabled]="isLoading" style="background: #3498db; color: white; padding: clamp(10px, 3vw, 12px) clamp(20px, 5vw, 24px); border: none; border-radius: 6px; cursor: pointer; font-size: clamp(0.9rem, 2.5vw, 1rem); font-weight: 500; width: 100%; min-height: 44px;">
          {{isLoading ? '🔄 Logging in...' : '🚀 Login'}}
        </button>
      </form>
    </div>
  `,
  styles: [`
    input:focus {
      outline: none;
      border-color: #3498db;
    }
    button:hover {
      background: #2980b9;
    }
    button:disabled {
      background: #95a5a6;
      cursor: not-allowed;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      input {
        padding: 14px;
        font-size: 16px; /* Prevents zoom on iOS */
      }
      
      button {
        padding: 14px 20px;
        min-height: 48px;
      }
    }
    
    @media (max-width: 480px) {
      input {
        padding: 16px;
        font-size: 16px;
      }
      
      button {
        padding: 16px 24px;
        min-height: 52px;
      }
    }
    
    /* Touch device optimizations */
    @media (hover: none) and (pointer: coarse) {
      input {
        min-height: 44px;
        font-size: 16px;
      }
      
      button {
        min-height: 44px;
        min-width: 44px;
      }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loginMessage = '';
  loginMessageStyle = '';
  isLoading = false;
  
  constructor(private databaseService: DatabaseService) {}
  
  login() {
    this.isLoading = true;
    this.loginMessage = '';
    
    this.databaseService.authenticateUser(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        if (response && response.success && response.user) {
          const user = response.user;
          this.loginMessage = `✅ Login successful! Welcome ${user.fullName || user.fullname || 'User'}! Redirecting to ${user.role} dashboard...`;
          this.loginMessageStyle = 'color: #155724; background: #d4edda; border: 1px solid #c3e6cb; padding: 10px; border-radius: 6px;';
          
          // Store login state
          localStorage.setItem('userToken', response.token);
          localStorage.setItem('userRole', user.role);
          localStorage.setItem('currentUser', JSON.stringify(user));
          
          // Redirect based on role
          setTimeout(() => {
            window.location.href = `/${user.role}-dashboard`;
          }, 1500);
        } else {
          this.loginMessage = '❌ Login failed. Invalid email or password.';
          this.loginMessageStyle = 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb; padding: 10px; border-radius: 6px;';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.loginMessage = '❌ Login error. Please check your connection and try again.';
        this.loginMessageStyle = 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb; padding: 10px; border-radius: 6px;';
        console.error('Login error:', error);
      }
    });
  }
}

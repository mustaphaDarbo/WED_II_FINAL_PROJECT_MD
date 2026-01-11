import { Component } from '@angular/core';

@Component({
  selector: 'app-debug-auth',
  template: `
    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 30px;">
      <h2 style="color: #2c3e50; margin-bottom: 30px;">🔍 Authentication Debug</h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">📋 Current Authentication Status</h3>
        
        <div style="margin-bottom: 15px;">
          <strong>🔑 Token:</strong> 
          <span [style]="token ? 'color: #27ae60;' : 'color: #e74c3c;'">
            {{token ? token.substring(0, 50) + '...' : '❌ No token found'}}
          </span>
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong>👤 User Role:</strong> 
          <span [style]="userRole ? 'color: #3498db;' : 'color: #e74c3c;'">
            {{userRole || '❌ No role found'}}
          </span>
        </div>
        
        <div style="margin-bottom: 15px;">
          <strong>👤 User Info:</strong> 
          <pre style="background: #f1f3f4; padding: 10px; border-radius: 4px; font-size: 0.9rem; overflow-x: auto;">{{currentUser}}</pre>
        </div>
      </div>
      
      <div style="margin-bottom: 20px;">
        <button (click)="testDirectAPI()" style="background: #3498db; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; margin-right: 10px;">
          🧪 Test Direct API Call
        </button>
        <button (click)="clearAuth()" style="background: #e74c3c; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500;">
          🗑️ Clear Authentication
        </button>
        <button (click)="goToLogin()" style="background: #27ae60; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500;">
          🔐 Go to Login
        </button>
      </div>
      
      <div *ngIf="apiTestResult" style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">🧪 API Test Result</h3>
        <pre style="background: #f1f3f4; padding: 10px; border-radius: 4px; font-size: 0.9rem; overflow-x: auto;">{{apiTestResult}}</pre>
      </div>
    </div>
  `,
  styles: [`
    button:hover {
      opacity: 0.9;
    }
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  `]
})
export class DebugAuthComponent {
  token: string | null = null;
  userRole: string | null = null;
  currentUser: string | null = null;
  apiTestResult: string | null = null;
  
  constructor() {
    this.loadAuthData();
  }
  
  loadAuthData() {
    this.token = localStorage.getItem('userToken');
    this.userRole = localStorage.getItem('userRole');
    this.currentUser = localStorage.getItem('currentUser');
  }
  
  testDirectAPI() {
    if (!this.token) {
      this.apiTestResult = '❌ No token available for testing';
      return;
    }
    
    this.apiTestResult = '🔄 Testing API call...';
    
    // Test direct API call
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:5000/api/users', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${this.token}`);
    
    xhr.onload = () => {
      if (xhr.status === 200) {
        this.apiTestResult = `✅ SUCCESS - Status: ${xhr.status}\nResponse: ${xhr.responseText.substring(0, 500)}`;
      } else {
        this.apiTestResult = `❌ FAILED - Status: ${xhr.status}\nResponse: ${xhr.responseText.substring(0, 500)}`;
      }
    };
    
    xhr.onerror = () => {
      this.apiTestResult = `❌ NETWORK ERROR - Could not connect to API`;
    };
    
    xhr.send();
  }
  
  clearAuth() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    this.loadAuthData();
    this.apiTestResult = '🗑️ Authentication cleared';
  }
  
  goToLogin() {
    window.location.href = '/login';
  }
}

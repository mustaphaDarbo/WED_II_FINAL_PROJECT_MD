import { Component } from '@angular/core';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-test-crud',
  template: `
    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 30px;">
      <h2 style="color: #2c3e50; margin-bottom: 30px;">🧪 CRUD Test</h2>
      
      <div *ngIf="!isAuthenticated" style="background: #fff3cd; color: #856404; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #ffeaa7;">
        <h3 style="color: #856404; margin-bottom: 15px;">⚠️ Authentication Required</h3>
        <p style="margin-bottom: 15px;">You need to be logged in as an administrator to test CRUD operations.</p>
        <button (click)="goToLogin()" style="background: #856404; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500;">
          🔐 Go to Login
        </button>
      </div>
      
      <div *ngIf="isAuthenticated">
      
      <div style="margin-bottom: 20px;">
        <button (click)="testArticleCRUD()" style="background: #9b59b6; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; margin-right: 10px;">
          Test Article CRUD
        </button>
        <button (click)="testUserCRUD()" style="background: #3498db; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; margin-right: 10px;">
          Test User CRUD
        </button>
        <button (click)="testCourseCRUD()" style="background: #27ae60; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500;">
          Test Course CRUD
        </button>
      </div>
      
      <div *ngIf="testResults.length > 0" style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h3 style="color: #2c3e50; margin-bottom: 15px;">📋 Test Results:</h3>
        <div *ngFor="let result of testResults" [style]="getResultStyle(result.success)" style="padding: 10px; margin-bottom: 10px; border-radius: 6px;">
          <strong>{{result.test}}:</strong> {{result.success ? '✅ SUCCESS' : '❌ FAILED'}} 
          <div *ngIf="result.error" style="margin-top: 5px; font-size: 0.9rem;">
            <strong>Error:</strong> {{result.error}}
          </div>
        </div>
      </div>
      </div>
    </div>
  `,
  styles: [`
    button:hover {
      opacity: 0.9;
    }
  `]
})
export class TestCrudComponent {
  testResults: any[] = [];
  isAuthenticated = false;
  
  constructor(private databaseService: DatabaseService) {
    this.checkAuthentication();
  }
  
  checkAuthentication() {
    const token = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');
    this.isAuthenticated = !!(token && userRole === 'admin');
    
    if (!this.isAuthenticated) {
      console.warn('⚠️ Not authenticated as admin. Please login first.');
    }
  }
  
  testArticleCRUD() {
    if (!this.isAuthenticated) {
      this.testResults.push({
        test: 'Create Article',
        success: false,
        error: 'Please login as admin first'
      });
      return;
    }
    
    console.log('🧪 Testing Article CRUD...');
    
    // Test Create Article
    const testArticle = {
      title: 'Test Article ' + Date.now(),
      description: 'Test description',
      content: 'Test content',
      category: 'announcement'
    };
    
    this.databaseService.createArticle(testArticle).subscribe({
      next: (response) => {
        console.log('✅ Article Create Response:', response);
        this.testResults.push({
          test: 'Create Article',
          success: response && response.success,
          error: response && !response.success ? (response.message || response.error || 'Unknown error') : null
        });
      },
      error: (error) => {
        console.error('❌ Article Create Error:', error);
        this.testResults.push({
          test: 'Create Article',
          success: false,
          error: error.message || 'Unknown error'
        });
      }
    });
  }
  
  testUserCRUD() {
    if (!this.isAuthenticated) {
      this.testResults.push({
        test: 'Create User',
        success: false,
        error: 'Please login as admin first'
      });
      return;
    }
    
    console.log('🧪 Testing User CRUD...');
    
    const timestamp = Date.now();
    const testUser = {
      fullName: 'Test User ' + timestamp,
      email: `testuser${timestamp}@ucums.edu`,
      password: 'password123',
      role: 'student'
    };
    
    this.databaseService.createUser(testUser).subscribe({
      next: (response) => {
        console.log('✅ User Create Response:', response);
        this.testResults.push({
          test: 'Create User',
          success: response && response.success,
          error: response && !response.success ? response.message : null
        });
      },
      error: (error) => {
        console.error('❌ User Create Error:', error);
        this.testResults.push({
          test: 'Create User',
          success: false,
          error: error.message || 'Unknown error'
        });
      }
    });
  }
  
  testCourseCRUD() {
    if (!this.isAuthenticated) {
      this.testResults.push({
        test: 'Create Course',
        success: false,
        error: 'Please login as admin first'
      });
      return;
    }
    
    console.log('🧪 Testing Course CRUD...');
    
    const testCourse = {
      courseCode: 'CRS' + Date.now().toString().slice(-6),
      title: 'Test Course',
      description: 'Test course description',
      lecturerId: '696380545e906b0cbf32f79a', // Valid lecturer ID
      creditUnits: 3,
      semester: 'first',
      academicYear: '2024/2025',
      maxStudents: 30
    };
    
    this.databaseService.createCourse(testCourse).subscribe({
      next: (response) => {
        console.log('✅ Course Create Response:', response);
        this.testResults.push({
          test: 'Create Course',
          success: response && response.success,
          error: response && !response.success ? response.message : null
        });
      },
      error: (error) => {
        console.error('❌ Course Create Error:', error);
        this.testResults.push({
          test: 'Create Course',
          success: false,
          error: error.message || 'Unknown error'
        });
      }
    });
  }
  
  getResultStyle(success: boolean) {
    return success 
      ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;'
      : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;';
  }
  
  goToLogin() {
    window.location.href = '/login';
  }
}

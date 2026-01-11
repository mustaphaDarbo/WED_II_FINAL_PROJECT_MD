import { Component } from '@angular/core';
import { DatabaseService, User } from './database.service';

@Component({
  selector: 'app-user-management',
  template: `
    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 30px;">
      <h2 style="color: #2c3e50; margin-bottom: 30px;">👥 User Management</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
        <!-- Create User Form -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 12px;">
          <h3 style="color: #2c3e50; margin: 0 0 20px 0;">👤 Create New User</h3>
          
          <div *ngIf="message" [style]="messageStyle" style="padding: 12px; border-radius: 6px; margin-bottom: 20px;">
            <p [innerHTML]="message"></p>
          </div>
          
          <form (ngSubmit)="createUser()">
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">👤 Full Name:</label>
              <input type="text" [(ngModel)]="newUser.fullName" name="fullName" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" placeholder="Enter full name" required>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📧 Email:</label>
              <input type="email" [(ngModel)]="newUser.email" name="email" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" placeholder="Enter email" required>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">🔒 Password:</label>
              <input type="password" [(ngModel)]="newUser.password" name="password" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" placeholder="Enter password" required>
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">🎭 Role:</label>
              <select [(ngModel)]="newUser.role" name="role" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" required>
                <option value="">Select Role</option>
                <option value="student">👨‍🎓 Student</option>
                <option value="lecturer">👨‍🏫 Lecturer</option>
              </select>
            </div>
            
            <button type="submit" [disabled]="isCreating" style="background: #27ae60; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; width: 100%;">
              {{isCreating ? '🔄 Creating...' : '➕ Create User'}}
            </button>
          </form>
        </div>
        
        <!-- Users List -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 12px;">
          <h3 style="color: #2c3e50; margin: 0 0 20px 0;">📋 Existing Users</h3>
          
          <div *ngIf="isLoading" style="text-align: center; padding: 20px;">
            <p style="color: #7f8c8d;">🔄 Loading users...</p>
          </div>
          
          <div *ngIf="!isLoading" style="max-height: 400px; overflow-y: auto;">
            <div *ngFor="let user of users; let i = index" style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #3498db;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <h4 style="margin: 0 0 5px 0; color: #2c3e50;">{{user.fullName}}</h4>
                  <p style="margin: 0 0 5px 0; color: #7f8c8d; font-size: 0.9rem;">📧 {{user.email}}</p>
                  <span style="background: {{getRoleColor(user.role)}}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem;">{{getRoleIcon(user.role)}} {{user.role}}</span>
                </div>
                <button (click)="deleteUser(user.id || '')" [disabled]="isDeleting === user.id" style="background: #e74c3c; color: white; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                  {{isDeleting === user.id ? '🔄' : '🗑️'}} Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    input:focus, select:focus {
      outline: none;
      border-color: #3498db;
    }
    button:hover {
      opacity: 0.9;
    }
    button:disabled {
      background: #95a5a6;
      cursor: not-allowed;
    }
  `]
})
export class UserManagementComponent {
  users: User[] = [];
  newUser = {
    fullName: '',
    email: '',
    password: '',
    role: 'student'
  };
  message = '';
  messageStyle = '';
  isLoading = false;
  isCreating = false;
  isDeleting: string | null = null;
  
  constructor(private databaseService: DatabaseService) {
    this.loadUsers();
  }
  
  loadUsers() {
    this.isLoading = true;
    this.databaseService.getUsers().subscribe({
      next: (response: any) => {
        this.users = response.users || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
        this.showMessage('❌ Error loading users. Please check your connection.', 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
      }
    });
  }
  
  createUser() {
    if (!this.newUser.fullName || !this.newUser.email || !this.newUser.password || !this.newUser.role) {
      this.showMessage('❌ Please fill in all fields', 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
      return;
    }
    
    this.isCreating = true;
    
    this.databaseService.createUser(this.newUser).subscribe({
      next: (response) => {
        this.isCreating = false;
        if (response && response.success) {
          this.showMessage(`✅ User "${this.newUser.fullName}" created successfully!`, 'color: #155724; background: #d4edda; border: 1px solid #c3e6cb;');
          
          // Reset form
          this.newUser = {
            fullName: '',
            email: '',
            password: '',
            role: 'student'
          };
          
          // Reload users list
          this.loadUsers();
        } else {
          this.showMessage(`❌ Error creating user: ${response.message || 'Unknown error'}`, 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
        }
      },
      error: (error) => {
        this.isCreating = false;
        this.showMessage(`❌ Error creating user: ${error.message || 'Unknown error'}`, 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
      }
    });
  }
  
  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.isDeleting = userId;
      
      this.databaseService.deleteUser(userId).subscribe({
        next: () => {
          this.isDeleting = null;
          this.showMessage('✅ User deleted successfully!', 'color: #155724; background: #d4edda; border: 1px solid #c3e6cb;');
          this.loadUsers();
        },
        error: (error) => {
          this.isDeleting = null;
          this.showMessage('❌ Failed to delete user', 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
        }
      });
    }
  }
  
  showMessage(msg: string, style: string) {
    this.message = msg;
    this.messageStyle = style;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
  
  getRoleColor(role: string): string {
    switch (role) {
      case 'admin': return '#9b59b6';
      case 'student': return '#3498db';
      case 'lecturer': return '#27ae60';
      default: return '#95a5a6';
    }
  }
  
  getRoleIcon(role: string): string {
    switch (role) {
      case 'admin': return '👥';
      case 'student': return '👨‍🎓';
      case 'lecturer': return '👨‍🏫';
      default: return '👤';
    }
  }
}

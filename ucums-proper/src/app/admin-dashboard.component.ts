import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div style="background: white; padding: clamp(20px, 5vw, 30px); border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 30px;">
      <h2 style="color: #2c3e50; margin-bottom: clamp(20px, 5vw, 30px); font-size: clamp(1.5rem, 4vw, 2rem);">⚙️ Admin Dashboard</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: clamp(15px, 3vw, 20px); margin-bottom: clamp(25px, 5vw, 40px);">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: clamp(20px, 4vw, 25px); border-radius: 12px; text-align: center; transition: transform 0.3s ease;">
          <div style="font-size: clamp(2rem, 5vw, 3rem);">👥</div>
          <div style="font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 700; margin: 10px 0;">{{stats.totalUsers}}</div>
          <p style="font-size: clamp(0.9rem, 2.5vw, 1rem);">Total Users</p>
          <small style="opacity: 0.8; font-size: clamp(0.8rem, 2vw, 0.9rem);">{{stats.activeUsers}} active</small>
        </div>
        
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: clamp(20px, 4vw, 25px); border-radius: 12px; text-align: center; transition: transform 0.3s ease;">
          <div style="font-size: clamp(2rem, 5vw, 3rem);">📚</div>
          <div style="font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 700; margin: 10px 0;">{{stats.totalCourses}}</div>
          <p style="font-size: clamp(0.9rem, 2.5vw, 1rem);">Total Courses</p>
          <small style="opacity: 0.8; font-size: clamp(0.8rem, 2vw, 0.9rem);">All active</small>
        </div>
        
        <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: clamp(20px, 4vw, 25px); border-radius: 12px; text-align: center; transition: transform 0.3s ease;">
          <div style="font-size: clamp(2rem, 5vw, 3rem);">📰</div>
          <div style="font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 700; margin: 10px 0;">{{stats.totalArticles}}</div>
          <p style="font-size: clamp(0.9rem, 2.5vw, 1rem);">Total Articles</p>
          <small style="opacity: 0.8; font-size: clamp(0.8rem, 2vw, 0.9rem);">Published</small>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: clamp(20px, 5vw, 30px); border-radius: 12px;">
        <h3 style="color: #2c3e50; margin-bottom: clamp(20px, 5vw, 25px); font-size: clamp(1.3rem, 3.5vw, 1.8rem);">🎛️ System Management</h3>
        <p style="color: #7f8c8d; margin-bottom: clamp(20px, 5vw, 25px); font-size: clamp(0.9rem, 2.5vw, 1rem);">Manage users, courses, and articles in UCUMS system.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: clamp(10px, 2.5vw, 15px);">
          <button (click)="showUserManagement()" style="background: #3498db; color: white; padding: clamp(10px, 3vw, 12px) clamp(20px, 5vw, 24px); border: none; border-radius: 6px; cursor: pointer; font-size: clamp(0.9rem, 2.5vw, 1rem); font-weight: 500; margin-bottom: 10px; min-height: 44px;">👥 Manage Users</button>
          <button (click)="showCourseManagement()" style="background: #27ae60; color: white; padding: clamp(10px, 3vw, 12px) clamp(20px, 5vw, 24px); border: none; border-radius: 6px; cursor: pointer; font-size: clamp(0.9rem, 2.5vw, 1rem); font-weight: 500; margin-bottom: 10px; min-height: 44px;">📚 Manage Courses</button>
          <button (click)="showArticleManagement()" style="background: #9b59b6; color: white; padding: clamp(10px, 3vw, 12px) clamp(20px, 5vw, 24px); border: none; border-radius: 6px; cursor: pointer; font-size: clamp(0.9rem, 2.5vw, 1rem); font-weight: 500; margin-bottom: 10px; min-height: 44px;">📰 Manage Articles</button>
          <button (click)="navigateToAnalytics()" style="background: #e67e22; color: white; padding: clamp(10px, 3vw, 12px) clamp(20px, 5vw, 24px); border: none; border-radius: 6px; cursor: pointer; font-size: clamp(0.9rem, 2.5vw, 1rem); font-weight: 500; margin-bottom: 10px; min-height: 44px;">📊 System Analytics</button>
          <button (click)="goToCrudTest()" style="background: #e74c3c; color: white; padding: clamp(10px, 3vw, 12px) clamp(20px, 5vw, 24px); border: none; border-radius: 6px; cursor: pointer; font-size: clamp(0.9rem, 2.5vw, 1rem); font-weight: 500; margin-bottom: 10px; min-height: 44px;">🧪 Test CRUD</button>
          <button (click)="logout()" style="background: #95a5a6; color: white; padding: clamp(10px, 3vw, 12px) clamp(20px, 5vw, 24px); border: none; border-radius: 6px; cursor: pointer; font-size: clamp(0.9rem, 2.5vw, 1rem); font-weight: 500; margin-bottom: 10px; min-height: 44px;">🚪 Logout</button>
        </div>
      </div>
      
      <!-- User Management Section -->
      <div *ngIf="showUserManagementSection" style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-top: 30px;">
        <app-user-management></app-user-management>
      </div>
      
      <!-- Course Management Section -->
      <div *ngIf="showCourseManagementSection" style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-top: 30px;">
        <app-course-management></app-course-management>
      </div>
      
      <!-- Article Management Section -->
      <div *ngIf="showArticleManagementSection" style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-top: 30px;">
        <app-article-management></app-article-management>
      </div>
    </div>
  `,
  styles: [`
    div:hover {
      transform: translateY(-5px);
    }
    button:hover {
      opacity: 0.9;
    }
  `]
})
export class AdminDashboardComponent {
  stats = {
    totalUsers: 5,
    totalCourses: 4,
    totalArticles: 12,
    activeUsers: 4
  };
  showUserManagementSection = false;
  showCourseManagementSection = false;
  showArticleManagementSection = false;
  
  showUserManagement() {
    this.showUserManagementSection = !this.showUserManagementSection;
    this.showCourseManagementSection = false;
    this.showArticleManagementSection = false;
  }
  
  showCourseManagement() {
    this.showCourseManagementSection = !this.showCourseManagementSection;
    this.showUserManagementSection = false;
    this.showArticleManagementSection = false;
  }
  
  showArticleManagement() {
    this.showArticleManagementSection = !this.showArticleManagementSection;
    this.showUserManagementSection = false;
    this.showCourseManagementSection = false;
  }
  
  navigateToAnalytics() {
    window.location.href = '/analytics';
  }
  
  goToCrudTest() {
    window.location.href = '/test-crud';
  }
  
  logout() {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-student-dashboard',
  template: `
    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 30px;">
      <h2 style="color: #2c3e50; margin-bottom: 30px;">👨‍🎓 Student Dashboard</h2>
      
      <div *ngIf="isLoading" style="text-align: center; padding: 50px;">
        <p style="color: #7f8c8d; font-size: 1.2rem;">🔄 Loading dashboard...</p>
      </div>

      <div *ngIf="!isLoading">
        <!-- Statistics Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; transition: transform 0.3s ease;">
            <div style="font-size: 3rem;">📖</div>
            <div style="font-size: 2.5rem; font-weight: 700; margin: 10px 0;">{{stats.enrolledCourses}}</div>
            <p>Enrolled Courses</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; transition: transform 0.3s ease;">
            <div style="font-size: 3rem;">📝</div>
            <div style="font-size: 2.5rem; font-weight: 700; margin: 10px 0;">{{stats.assignments}}</div>
            <p>Assignments</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; transition: transform 0.3s ease;">
            <div style="font-size: 3rem;">🏆</div>
            <div style="font-size: 2.5rem; font-weight: 700; margin: 10px 0;">{{stats.averageGrade}}%</div>
            <p>Average Grade</p>
          </div>
        </div>
        
        <!-- My Courses Section -->
        <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin-bottom: 25px;">
          <h3 style="color: #2c3e50; margin-bottom: 25px;">📚 My Enrolled Courses</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 25px;">
            <div *ngFor="let course of enrolledCourses" style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3498db; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h4 style="color: #2c3e50; margin: 0 0 10px 0;">{{course.courseCode}} - {{course.title}}</h4>
              <p style="color: #7f8c8d; margin: 0 0 10px 0;">{{course.description}}</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #27ae60; font-weight: 500;">📊 {{course.creditUnits}} credits</span>
                <span style="color: #3498db; font-weight: 500;">👨‍🏫 {{course.lecturerId?.fullName || 'N/A'}}</span>
              </div>
            </div>
          </div>
          
          <div *ngIf="enrolledCourses.length === 0" style="text-align: center; padding: 30px; background: white; border-radius: 8px;">
            <p style="color: #7f8c8d; font-size: 1.1rem;">📚 You haven't enrolled in any courses yet.</p>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div style="display: flex; flex-wrap: wrap; gap: 15px;">
          <button (click)="viewProfile()" style="background: #3498db; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; margin-bottom: 10px;">👤 My Profile</button>
          <button (click)="viewArticles()" style="background: #27ae60; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; margin-bottom: 10px;">📰 View Articles</button>
          <button (click)="registerCourses()" style="background: #9b59b6; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; margin-bottom: 10px;">📝 Register Courses</button>
          <button (click)="viewGrades()" style="background: #e67e22; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; margin-bottom: 10px;">📊 View Grades</button>
          <button (click)="viewAssignments()" style="background: #f39c12; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; margin-bottom: 10px;">📝 My Assignments</button>
          <button (click)="logout()" style="background: #e74c3c; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; margin-bottom: 10px;">🚪 Logout</button>
        </div>
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
export class StudentDashboardComponent implements OnInit {
  stats = {
    enrolledCourses: 0,
    assignments: 0,
    averageGrade: 0
  };
  
  enrolledCourses: any[] = [];
  isLoading = false;

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Load enrolled courses
    this.databaseService.getEnrolledCourses(currentUser.id).subscribe({
      next: (response: any) => {
        this.enrolledCourses = response.data || [];
        this.stats.enrolledCourses = this.enrolledCourses.length;
        
        // Calculate stats
        this.calculateStats();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }

  calculateStats() {
    // Calculate assignments count (simplified)
    this.stats.assignments = this.enrolledCourses.reduce((total, course) => {
      return total + (course.assignments?.length || 0);
    }, 0);

    // Calculate average grade (simplified)
    const grades = this.enrolledCourses
      .filter(course => course.finalGrade)
      .map(course => course.finalGrade);
    
    this.stats.averageGrade = grades.length > 0 
      ? Math.round(grades.reduce((sum, grade) => sum + grade, 0) / grades.length)
      : 0;
  }

  viewProfile() {
    window.location.href = '/student-profile';
  }
  
  viewArticles() {
    window.location.href = '/home'; // Redirect to articles page
  }
  
  registerCourses() {
    window.location.href = '/course-registration';
  }
  
  viewGrades() {
    window.location.href = '/student-grades';
  }

  viewAssignments() {
    window.location.href = '/student-assignments';
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

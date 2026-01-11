import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-lecturer-dashboard',
  template: `
    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 30px;">
      <h2 style="color: #2c3e50; margin-bottom: 30px;">👨‍🏫 Lecturer Dashboard</h2>
      
      <div *ngIf="isLoading" style="text-align: center; padding: 50px;">
        <p style="color: #7f8c8d; font-size: 1.2rem;">🔄 Loading dashboard...</p>
      </div>

      <div *ngIf="!isLoading">
        <!-- Statistics Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; transition: transform 0.3s ease; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
            <div style="font-size: 3rem;">📚</div>
            <div style="font-size: 2.5rem; font-weight: 700; margin: 10px 0;">{{stats.totalCourses}}</div>
            <p style="margin: 0; font-size: 1.1rem;">Total Courses</p>
            <small style="opacity: 0.9; font-size: 0.9rem;">Active this semester</small>
          </div>
          
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; transition: transform 0.3s ease; box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3);">
            <div style="font-size: 3rem;">👥</div>
            <div style="font-size: 2.5rem; font-weight: 700; margin: 10px 0;">{{stats.totalStudents}}</div>
            <p style="margin: 0; font-size: 1.1rem;">Total Students</p>
            <small style="opacity: 0.9; font-size: 0.9rem;">Across all courses</small>
          </div>
          
          <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; transition: transform 0.3s ease; box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);">
            <div style="font-size: 3rem;">📝</div>
            <div style="font-size: 2.5rem; font-weight: 700; margin: 10px 0;">{{stats.totalAssignments}}</div>
            <p style="margin: 0; font-size: 1.1rem;">Assignments</p>
            <small style="opacity: 0.9; font-size: 0.9rem;">Total created</small>
          </div>

          <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; transition: transform 0.3s ease; box-shadow: 0 4px 15px rgba(250, 112, 154, 0.3);">
            <div style="font-size: 3rem;">📊</div>
            <div style="font-size: 2.5rem; font-weight: 700; margin: 10px 0;">{{stats.averageGrade}}%</div>
            <p style="margin: 0; font-size: 1.1rem;">Average Grade</p>
            <small style="opacity: 0.9; font-size: 0.9rem;">Class performance</small>
          </div>
        </div>
        
        <!-- My Courses Section -->
        <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin-bottom: 25px;">
          <h3 style="color: #2c3e50; margin-bottom: 25px;">📚 My Courses</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; margin-bottom: 25px;">
            <div *ngFor="let course of myCourses" style="background: white; padding: 25px; border-radius: 12px; border-left: 4px solid #27ae60; box-shadow: 0 4px 15px rgba(0,0,0,0.1); transition: transform 0.3s ease, box-shadow 0.3s ease;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                <div style="flex: 1;">
                  <h4 style="color: #2c3e50; margin: 0 0 8px 0; font-size: 1.2rem; font-weight: 600;">{{course.courseCode}}</h4>
                  <h5 style="color: #34495e; margin: 0 0 12px 0; font-size: 1rem; font-weight: 500;">{{course.title}}</h5>
                  <p style="color: #7f8c8d; margin: 0 0 15px 0; line-height: 1.5; font-size: 0.9rem;">{{course.description || 'No description available'}}</p>
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <div style="text-align: center;">
                  <div style="color: #27ae60; font-size: 1.8rem; font-weight: 700;">{{course.creditUnits || 3}}</div>
                  <div style="color: #7f8c8d; font-size: 0.8rem;">Credits</div>
                </div>
                <div style="text-align: center;">
                  <div style="color: #3498db; font-size: 1.8rem; font-weight: 700;">{{course.enrolledStudents?.length || 0}}</div>
                  <div style="color: #7f8c8d; font-size: 0.8rem;">Students</div>
                </div>
              </div>
              
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button (click)="viewCourseStudents(course._id)" style="background: #3498db; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 500; transition: background 0.3s ease;">
                  👥 View Students
                </button>
                <button (click)="manageAssignments(course._id)" style="background: #9b59b6; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 500; transition: background 0.3s ease;">
                  📝 Assignments
                </button>
                <button (click)="viewGrades(course._id)" style="background: #e67e22; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 500; transition: background 0.3s ease;">
                  📊 Grades
                </button>
              </div>
            </div>
          </div>
          
          <div *ngIf="myCourses.length === 0" style="text-align: center; padding: 50px; background: white; border-radius: 12px; border: 2px dashed #e0e0e0;">
            <div style="font-size: 3rem; margin-bottom: 15px;">📚</div>
            <p style="color: #7f8c8d; font-size: 1.2rem; margin: 0;">You haven't been assigned any courses yet.</p>
            <p style="color: #95a5a6; font-size: 1rem; margin: 10px 0 0 0;">Contact the administrator to get course assignments.</p>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h3 style="color: #2c3e50; margin-bottom: 20px;">🎛️ Quick Actions</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <button (click)="viewAnalytics()" style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; padding: 15px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 0.95rem; font-weight: 500; transition: transform 0.3s ease, box-shadow 0.3s ease; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.2rem;">📊</span>
              <span>Performance Analytics</span>
            </button>
            <button (click)="createContent()" style="background: linear-gradient(135deg, #27ae60 0%, #229954 100%); color: white; padding: 15px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 0.95rem; font-weight: 500; transition: transform 0.3s ease, box-shadow 0.3s ease; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.2rem;">📝</span>
              <span>Create Content</span>
            </button>
            <button (click)="viewArticles()" style="background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); color: white; padding: 15px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 0.95rem; font-weight: 500; transition: transform 0.3s ease, box-shadow 0.3s ease; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.2rem;">📰</span>
              <span>View Articles</span>
            </button>
            <button (click)="manageProfile()" style="background: linear-gradient(135deg, #e67e22 0%, #d35400 100%); color: white; padding: 15px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 0.95rem; font-weight: 500; transition: transform 0.3s ease, box-shadow 0.3s ease; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.2rem;">👤</span>
              <span>My Profile</span>
            </button>
            <button (click)="logout()" style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 15px 20px; border: none; border-radius: 8px; cursor: pointer; font-size: 0.95rem; font-weight: 500; transition: transform 0.3s ease, box-shadow 0.3s ease; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 1.2rem;">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    div:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
      opacity: 0.95;
    }
    button:active {
      transform: translateY(0);
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    * {
      transition: all 0.3s ease;
    }
  `]
})
export class LecturerDashboardComponent implements OnInit {
  stats = {
    totalCourses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    averageGrade: 0
  };
  
  myCourses: any[] = [];
  isLoading = false;

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Load lecturer's courses
    this.databaseService.getLecturerCourses(currentUser.id).subscribe({
      next: (response: any) => {
        this.myCourses = response.data || [];
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
    this.stats.totalCourses = this.myCourses.length;
    
    // Calculate total students
    this.stats.totalStudents = this.myCourses.reduce((total, course) => {
      return total + (course.enrolledStudents?.length || 0);
    }, 0);

    // Calculate total assignments
    this.stats.totalAssignments = this.myCourses.reduce((total, course) => {
      return total + (course.assignments?.length || 0);
    }, 0);

    // Calculate average grade (simplified)
    const allGrades = this.myCourses.flatMap(course => 
      course.grades?.map((grade: any) => grade.total) || []
    );
    
    this.stats.averageGrade = allGrades.length > 0 
      ? Math.round(allGrades.reduce((sum, grade) => sum + grade, 0) / allGrades.length)
      : 0;
  }

  viewAnalytics() {
    window.location.href = '/lecturer-analytics';
  }

  createContent() {
    alert('📝 Create Content: Create articles, assignments, and course materials');
  }

  viewArticles() {
    window.location.href = '/home'; // Redirect to articles page
  }

  manageProfile() {
    alert('👤 Profile Management: Update your profile information');
  }

  viewCourseStudents(courseId: string) {
    window.location.href = `/course-students/${courseId}`;
  }

  manageAssignments(courseId: string) {
    window.location.href = `/assignment-management/${courseId}`;
  }

  viewGrades(courseId: string) {
    window.location.href = `/grade-management/${courseId}`;
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

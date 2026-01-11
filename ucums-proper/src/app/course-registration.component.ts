import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-course-registration',
  template: `
    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h3 style="color: #2c3e50; margin-bottom: 25px;">📝 Course Registration</h3>
      
      <div *ngIf="isLoading" style="text-align: center; padding: 50px;">
        <p style="color: #7f8c8d; font-size: 1.2rem;">🔄 Loading available courses...</p>
      </div>

      <div *ngIf="!isLoading" style="display: grid; gap: 20px;">
        <div *ngFor="let course of availableCourses" style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #27ae60;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="flex: 1;">
              <h4 style="color: #2c3e50; margin: 0 0 10px 0;">{{course.courseCode}} - {{course.title}}</h4>
              <p style="color: #7f8c8d; margin: 0 0 10px 0; line-height: 1.4;">{{course.description}}</p>
              <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                <span style="color: #27ae60; font-weight: 500;">📊 {{course.creditUnits}} credits</span>
                <span style="color: #3498db; font-weight: 500;">👥 {{course.enrolledStudents?.length || 0}}/{{course.maxStudents}} students</span>
                <span style="color: #f39c12; font-weight: 500;">📅 {{course.semester}} semester</span>
                <span style="color: #9b59b6; font-weight: 500;">👨‍🏫 {{course.lecturerId?.fullName || 'N/A'}}</span>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <button 
                *ngIf="!isRegistered(course._id)"
                (click)="registerForCourse(course._id)" 
                [disabled]="isRegistering === course._id"
                style="background: #27ae60; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">
                {{isRegistering === course._id ? '🔄 Registering...' : '✅ Register'}}
              </button>
              <button 
                *ngIf="isRegistered(course._id)"
                (click)="unregisterFromCourse(course._id)" 
                [disabled]="isUnregistering === course._id"
                style="background: #e74c3c; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">
                {{isUnregistering === course._id ? '🔄 Unregistering...' : '❌ Unregister'}}
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="availableCourses.length === 0" style="text-align: center; padding: 50px; background: #f8f9fa; border-radius: 8px;">
          <p style="color: #7f8c8d; font-size: 1.1rem;">📚 No available courses at the moment.</p>
        </div>
      </div>

      <div style="margin-top: 30px;">
        <button (click)="goBack()" style="background: #3498db; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500;">
          ← Back to Dashboard
        </button>
      </div>
    </div>
  `,
  styles: [`
    button:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class CourseRegistrationComponent implements OnInit {
  availableCourses: any[] = [];
  enrolledCourses: any[] = [];
  isLoading = false;
  isRegistering: string | null = null;
  isUnregistering: string | null = null;

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.loadAvailableCourses();
    this.loadEnrolledCourses();
  }

  loadAvailableCourses() {
    this.isLoading = true;
    this.databaseService.getCourses().subscribe({
      next: (response: any) => {
        this.availableCourses = response.data || [];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading courses:', error);
        this.isLoading = false;
      }
    });
  }

  loadEnrolledCourses() {
    // Get current user's enrolled courses
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.databaseService.getEnrolledCourses(currentUser.id).subscribe({
      next: (response: any) => {
        this.enrolledCourses = response.data || [];
      },
      error: (error: any) => {
        console.error('Error loading enrolled courses:', error);
      }
    });
  }

  isRegistered(courseId: string): boolean {
    return this.enrolledCourses.some((course: any) => course._id === courseId);
  }

  registerForCourse(courseId: string) {
    this.isRegistering = courseId;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    this.databaseService.enrollInCourse(courseId, currentUser.id).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('✅ Successfully registered for course!');
          this.loadEnrolledCourses(); // Refresh enrolled courses
        } else {
          alert('❌ Failed to register: ' + response.message);
        }
        this.isRegistering = null;
      },
      error: (error: any) => {
        alert('❌ Error registering for course: ' + error.message);
        this.isRegistering = null;
      }
    });
  }

  unregisterFromCourse(courseId: string) {
    this.isUnregistering = courseId;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    this.databaseService.unenrollFromCourse(courseId, currentUser.id).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('✅ Successfully unregistered from course!');
          this.loadEnrolledCourses(); // Refresh enrolled courses
        } else {
          alert('❌ Failed to unregister: ' + response.message);
        }
        this.isUnregistering = null;
      },
      error: (error: any) => {
        alert('❌ Error unregistering from course: ' + error.message);
        this.isUnregistering = null;
      }
    });
  }

  goBack() {
    window.location.href = '/student-dashboard';
  }
}

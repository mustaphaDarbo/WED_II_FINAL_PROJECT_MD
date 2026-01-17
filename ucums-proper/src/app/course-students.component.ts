import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-students',
  template: `
    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h3 style="color: #2c3e50; margin-bottom: 25px;">👥 Course Students</h3>
      
      <div *ngIf="isLoading" style="text-align: center; padding: 50px;">
        <p style="color: #7f8c8d; font-size: 1.2rem;">🔄 Loading students...</p>
      </div>

      <div *ngIf="!isLoading">
        <!-- Course Info -->
        <div *ngIf="courseInfo" style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
          <h4 style="color: #2c3e50; margin: 0 0 10px 0;">{{courseInfo.courseCode}} - {{courseInfo.title}}</h4>
          <p style="color: #7f8c8d; margin: 0;">{{courseInfo.description}}</p>
        </div>

        <!-- Students List -->
        <div *ngIf="students.length > 0">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <div *ngFor="let student of students" style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3498db; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div *ngIf="student.profileImage" style="width: 50px; height: 50px; border-radius: 50%; overflow: hidden; margin-right: 15px;">
                  <img [src]="'https://wed-ii-final-project-md.onrender.com' + student.profileImage" [alt]="student.fullName" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div *ngIf="!student.profileImage" style="width: 50px; height: 50px; border-radius: 50%; background: #ecf0f1; display: flex; align-items: center; justify-content: center; margin-right: 15px; color: #7f8c8d; font-size: 1.2rem;">
                  {{student.fullName?.charAt(0) || 'S'}}
                </div>
                <div>
                  <h4 style="color: #2c3e50; margin: 0 0 5px 0;">{{student.fullName}}</h4>
                  <p style="color: #7f8c8d; margin: 0; font-size: 0.9rem;">{{student.email}}</p>
                </div>
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.9rem;">
                <div *ngIf="student.phoneNumber">
                  <strong>Phone:</strong> {{student.phoneNumber}}
                </div>
                <div *ngIf="student.studentId">
                  <strong>Student ID:</strong> {{student.studentId}}
                </div>
                <div *ngIf="student.address">
                  <strong>Address:</strong> {{student.address}}
                </div>
                <div *ngIf="student.dateOfBirth">
                  <strong>DOB:</strong> {{student.dateOfBirth | date:'mediumDate'}}
                </div>
              </div>
              
              <div *ngIf="student.bio" style="margin-top: 10px; font-size: 0.9rem;">
                <strong>Bio:</strong> {{student.bio}}
              </div>
              
              <div style="margin-top: 15px; display: flex; gap: 10px;">
                <button (click)="viewStudentGrades(student._id)" style="background: #27ae60; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                  📊 View Grades
                </button>
                <button (click)="contactStudent(student.email)" style="background: #3498db; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                  ✉️ Contact
                </button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="students.length === 0" style="text-align: center; padding: 50px; background: #f8f9fa; border-radius: 8px;">
          <p style="color: #7f8c8d; font-size: 1.1rem;">👥 No students enrolled in this course yet.</p>
        </div>

        <!-- Back Button -->
        <div style="margin-top: 25px;">
          <button (click)="goBack()" style="background: #95a5a6; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem;">
            ← Back to Dashboard
          </button>
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
export class CourseStudentsComponent implements OnInit {
  courseId: string = '';
  students: any[] = [];
  courseInfo: any = {};
  isLoading = false;

  constructor(
    private databaseService: DatabaseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    if (this.courseId) {
      this.loadCourseStudents();
    }
  }

  loadCourseStudents() {
    this.isLoading = true;
    
    // Load course info first
    this.databaseService.getCourse(this.courseId).subscribe({
      next: (response: any) => {
        this.courseInfo = response.data || {};
        
        // Load students
        this.databaseService.getCourseStudents(this.courseId).subscribe({
          next: (studentsResponse: any) => {
            this.students = studentsResponse.data || [];
            this.isLoading = false;
          },
          error: (error: any) => {
            console.error('Error loading students:', error);
            this.isLoading = false;
          }
        });
      },
      error: (error: any) => {
        console.error('Error loading course:', error);
        this.isLoading = false;
      }
    });
  }

  viewStudentGrades(studentId: string) {
    window.location.href = `/student-grades/${studentId}`;
  }

  contactStudent(email: string) {
    window.location.href = `mailto:${email}`;
  }

  goBack() {
    window.location.href = '/lecturer-dashboard';
  }
}

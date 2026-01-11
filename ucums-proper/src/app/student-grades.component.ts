import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-student-grades',
  template: `
    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h3 style="color: #2c3e50; margin-bottom: 25px;">📊 My Grades</h3>
      
      <div *ngIf="isLoading" style="text-align: center; padding: 50px;">
        <p style="color: #7f8c8d; font-size: 1.2rem;">🔄 Loading grades...</p>
      </div>

      <div *ngIf="!isLoading">
        <!-- Grade Summary -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
            <div style="text-align: center;">
              <div style="font-size: 2.5rem; font-weight: 700;">{{gradeSummary.averageGrade}}</div>
              <div style="opacity: 0.9;">Average Grade</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 2.5rem; font-weight: 700;">{{gradeSummary.gpa}}</div>
              <div style="opacity: 0.9;">GPA</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 2.5rem; font-weight: 700;">{{gradeSummary.totalCourses}}</div>
              <div style="opacity: 0.9;">Total Courses</div>
            </div>
          </div>
        </div>

        <!-- Grade Details by Course -->
        <div style="display: grid; gap: 20px;">
          <div *ngFor="let courseGrade of courseGrades" style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #27ae60;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
              <div>
                <h4 style="color: #2c3e50; margin: 0 0 5px 0;">{{courseGrade.courseCode}} - {{courseGrade.courseTitle}}</h4>
                <p style="color: #7f8c8d; margin: 0; font-size: 0.9rem;">{{courseGrade.lecturerName}}</p>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 1.5rem; font-weight: bold; color: #27ae60;">{{courseGrade.finalGrade}}</div>
                <div style="color: #7f8c8d; font-size: 0.8rem;">Final Grade</div>
              </div>
            </div>

            <!-- Assignment Grades -->
            <div style="background: white; padding: 15px; border-radius: 6px;">
              <h5 style="color: #2c3e50; margin: 0 0 15px 0;">Assignment Breakdown</h5>
              <div style="display: grid; gap: 10px;">
                <div *ngFor="let assignment of courseGrade.assignments" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 4px;">
                  <div style="flex: 1;">
                    <div style="font-weight: 500; color: #2c3e50;">{{assignment.title}}</div>
                    <div style="color: #7f8c8d; font-size: 0.8rem;">{{assignment.type}} • {{assignment.dueDate}}</div>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-weight: bold; color: #3498db;">{{assignment.score}}/{{assignment.totalMarks}}</div>
                    <div style="color: #7f8c8d; font-size: 0.8rem;">{{assignment.percentage}}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="courseGrades.length === 0" style="text-align: center; padding: 50px; background: #f8f9fa; border-radius: 8px;">
            <p style="color: #7f8c8d; font-size: 1.1rem;">📚 No grades available yet.</p>
          </div>
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
    button:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
  `]
})
export class StudentGradesComponent implements OnInit {
  courseGrades: any[] = [];
  gradeSummary: any = {
    averageGrade: 0,
    gpa: 0,
    totalCourses: 0
  };
  isLoading = false;

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.loadGrades();
  }

  loadGrades() {
    this.isLoading = true;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    this.databaseService.getStudentGrades(currentUser.id).subscribe({
      next: (response: any) => {
        this.courseGrades = response.data?.courseGrades || [];
        this.calculateGradeSummary();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading grades:', error);
        this.isLoading = false;
      }
    });
  }

  calculateGradeSummary() {
    if (this.courseGrades.length === 0) {
      this.gradeSummary = { averageGrade: 0, gpa: 0, totalCourses: 0 };
      return;
    }

    const totalGrade = this.courseGrades.reduce((sum, course) => sum + (course.finalGrade || 0), 0);
    const averageGrade = totalGrade / this.courseGrades.length;
    
    // Convert to GPA scale (simplified)
    const gpa = this.calculateGPA(averageGrade);
    
    this.gradeSummary = {
      averageGrade: averageGrade.toFixed(1),
      gpa: gpa.toFixed(2),
      totalCourses: this.courseGrades.length
    };
  }

  calculateGPA(averageGrade: number): number {
    if (averageGrade >= 90) return 4.0;
    if (averageGrade >= 80) return 3.0;
    if (averageGrade >= 70) return 2.0;
    if (averageGrade >= 60) return 1.0;
    return 0.0;
  }

  goBack() {
    window.location.href = '/student-dashboard';
  }
}

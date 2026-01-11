import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-student-assignments',
  template: `
    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 30px;">
      <h2 style="color: #2c3e50; margin-bottom: 30px;">📝 My Assignments</h2>
      
      <div *ngIf="isLoading" style="text-align: center; padding: 50px;">
        <p style="color: #7f8c8d; font-size: 1.2rem;">🔄 Loading assignments...</p>
      </div>

      <div *ngIf="!isLoading">
        <div style="display: grid; gap: 20px;">
          <div *ngFor="let assignment of assignments" style="background: #f8f9fa; padding: 25px; border-radius: 12px; border-left: 4px solid #e67e22; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
              <div style="flex: 1;">
                <h4 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 1.2rem;">{{assignment.title}}</h4>
                <p style="color: #7f8c8d; margin: 0 0 10px 0; line-height: 1.5;">{{assignment.description}}</p>
                <div style="display: flex; gap: 15px; margin-top: 10px;">
                  <span style="color: #e67e22; font-weight: 500;">📅 Due: {{assignment.dueDate || 'Not set'}}</span>
                  <span style="color: #f39c12; font-weight: 500;">📊 Points: {{assignment.totalPoints || 100}}</span>
                  <span style="color: #3498db; font-weight: 500;">📚 Course: {{assignment.courseCode}}</span>
                </div>
              </div>
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; gap: 10px;">
                  <span style="color: #27ae60; font-weight: 500;">Status:</span>
                  <span [style]="getStatusStyle(assignment.status)" style="padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">
                    {{getStatusText(assignment.status)}}
                  </span>
                </div>
                <div style="display: flex; gap: 10px;">
                  <span style="color: #e67e22; font-weight: 500;">Grade:</span>
                  <span [style]="getGradeStyle(assignment.grade)" style="padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; font-weight: 600;">
                    {{assignment.grade || 'Not graded'}}
                  </span>
                </div>
                <div *ngIf="assignment.submissionUrl" style="margin-top: 10px;">
                  <a [href]="assignment.submissionUrl" target="_blank" style="color: #3498db; text-decoration: none; font-weight: 500;">
                    🔗 Submit Assignment
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div *ngIf="assignments.length === 0" style="text-align: center; padding: 50px; background: white; border-radius: 8px;">
          <div style="font-size: 3rem; margin-bottom: 15px;">📝</div>
          <p style="color: #7f8c8d; font-size: 1.1rem;">No assignments available</p>
          <p style="color: #95a5a6; font-size: 0.9rem;">You haven't been assigned any assignments yet.</p>
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
    div:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    a:hover {
      opacity: 0.8;
    }
  `]
})
export class StudentAssignmentsComponent implements OnInit {
  assignments: any[] = [];
  isLoading = false;

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.loadAssignments();
  }

  loadAssignments() {
    this.isLoading = true;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.assignments = [
        {
          _id: '1',
          title: 'Midterm Exam Preparation',
          description: 'Complete the midterm exam preparation guide and submit your answers',
          dueDate: '2024-02-15',
          totalPoints: 100,
          courseCode: 'CS102',
          status: 'pending',
          grade: null,
          submissionUrl: 'https://example.com/submit-midterm'
        },
        {
          _id: '2',
          title: 'Project Proposal',
          description: 'Submit a detailed proposal for your final project including timeline and requirements',
          dueDate: '2024-02-10',
          totalPoints: 50,
          courseCode: 'CS102',
          status: 'submitted',
          grade: 'B',
          submissionUrl: null
        },
        {
          _id: '3',
          title: 'Lab Report',
          description: 'Complete and submit the lab report for experiment 3',
          dueDate: '2024-02-20',
          totalPoints: 75,
          courseCode: 'CS102',
          status: 'graded',
          grade: 'A-',
          submissionUrl: null
        }
      ];
      this.isLoading = false;
    }, 1000);
  }

  getStatusStyle(status: string): string {
    const styles: { [key: string]: string } = {
      pending: 'background: #f39c12; color: white;',
      submitted: 'background: #3498db; color: white;',
      graded: 'background: #27ae60; color: white;'
    };
    return styles[status] || 'background: #95a5a6; color: white;';
  }

  getStatusText(status: string): string {
    const texts: { [key: string]: string } = {
      pending: 'Pending',
      submitted: 'Submitted',
      graded: 'Graded'
    };
    return texts[status] || 'Unknown';
  }

  getGradeStyle(grade: string): string {
    if (!grade) return 'background: #95a5a6; color: white;';
    
    const gradeNum = parseInt(grade.replace(/[^0-9]/g, ''));
    if (gradeNum >= 90) return 'background: #27ae60; color: white;';
    if (gradeNum >= 80) return 'background: #3498db; color: white;';
    if (gradeNum >= 70) return 'background: #f39c12; color: white;';
    if (gradeNum >= 60) return 'background: #e67e22; color: white;';
    return 'background: #e74c3c; color: white;';
  }

  goBack() {
    window.location.href = '/student-dashboard';
  }
}

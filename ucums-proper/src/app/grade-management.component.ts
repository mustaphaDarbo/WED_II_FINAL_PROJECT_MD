import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-grade-management',
  template: `
    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
        <h2 style="color: #2c3e50; margin: 0;">📊 Grade Management</h2>
        <button (click)="goBack()" style="background: #3498db; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;">
          ← Back to Dashboard
        </button>
      </div>
      
      <div *ngIf="isLoading" style="text-align: center; padding: 50px;">
        <p style="color: #7f8c8d; font-size: 1.2rem;">🔄 Loading grades...</p>
      </div>

      <div *ngIf="!isLoading">
        <!-- Grade Statistics -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div style="background: linear-gradient(135deg, #27ae60 0%, #229954 100%); color: white; padding: 20px; border-radius: 12px; text-align: center;">
            <div style="font-size: 2rem;">📈</div>
            <div style="font-size: 1.8rem; font-weight: 700;">{{stats.averageGrade}}%</div>
            <div>Class Average</div>
          </div>
          <div style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; padding: 20px; border-radius: 12px; text-align: center;">
            <div style="font-size: 2rem;">👥</div>
            <div style="font-size: 1.8rem; font-weight: 700;">{{stats.totalStudents}}</div>
            <div>Total Students</div>
          </div>
          <div style="background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white; padding: 20px; border-radius: 12px; text-align: center;">
            <div style="font-size: 2rem;">✅</div>
            <div style="font-size: 1.8rem; font-weight: 700;">{{stats.passedStudents}}</div>
            <div>Passed</div>
          </div>
          <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 20px; border-radius: 12px; text-align: center;">
            <div style="font-size: 2rem;">❌</div>
            <div style="font-size: 1.8rem; font-weight: 700;">{{stats.failedStudents}}</div>
            <div>Failed</div>
          </div>
        </div>

        <!-- Grade Entry -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
          <h3 style="color: #2c3e50; margin-bottom: 20px;">📝 Enter Grades</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <select [(ngModel)]="selectedStudent" style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
              <option value="">Select Student</option>
              <option *ngFor="let student of students" [value]="student.id">{{student.name}}</option>
            </select>
            <input 
              [(ngModel)]="gradeScore" 
              type="number" 
              placeholder="Grade (0-100)" 
              min="0" 
              max="100"
              style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
            <input 
              [(ngModel)]="gradeAssignment" 
              type="text" 
              placeholder="Assignment Name" 
              style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
          </div>
          <button 
            (click)="submitGrade()" 
            [disabled]="!selectedStudent || !gradeScore || !gradeAssignment"
            style="background: #27ae60; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500;">
            📊 Submit Grade
          </button>
        </div>

        <!-- Student Grades Table -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 12px;">
          <h3 style="color: #2c3e50; margin-bottom: 20px;">📋 Student Grades</h3>
          <div *ngIf="grades.length === 0" style="text-align: center; padding: 40px; background: white; border-radius: 8px;">
            <div style="font-size: 3rem; margin-bottom: 15px;">📊</div>
            <p style="color: #7f8c8d; font-size: 1.1rem;">No grades recorded yet.</p>
          </div>
          
          <div *ngIf="grades.length > 0" style="background: white; border-radius: 8px; overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #3498db; color: white;">
                  <th style="padding: 15px; text-align: left;">Student Name</th>
                  <th style="padding: 15px; text-align: left;">Assignment</th>
                  <th style="padding: 15px; text-align: center;">Score</th>
                  <th style="padding: 15px; text-align: center;">Grade</th>
                  <th style="padding: 15px; text-align: center;">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let grade of grades" style="border-bottom: 1px solid #eee;">
                  <td style="padding: 15px;">{{grade.studentName}}</td>
                  <td style="padding: 15px;">{{grade.assignment}}</td>
                  <td style="padding: 15px; text-align: center; font-weight: 600;">{{grade.score}}%</td>
                  <td style="padding: 15px; text-align: center;">
                    <span [style]="getGradeColor(grade.score)" style="padding: 4px 8px; border-radius: 4px; font-weight: 600;">
                      {{getLetterGrade(grade.score)}}
                    </span>
                  </td>
                  <td style="padding: 15px; text-align: center;">
                    <button (click)="editGrade(grade)" style="background: #f39c12; color: white; padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                      ✏️ Edit
                    </button>
                    <button (click)="deleteGrade(grade.id)" style="background: #e74c3c; color: white; padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem; margin-left: 5px;">
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    table {
      font-size: 0.9rem;
    }
    th {
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    tr:hover {
      background-color: #f8f9fa;
    }
    button:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    select, input {
      transition: border-color 0.3s ease;
    }
    select:focus, input:focus {
      outline: none;
      border-color: #3498db;
    }
  `]
})
export class GradeManagementComponent implements OnInit {
  courseId: string = '';
  grades: any[] = [];
  students: any[] = [];
  isLoading = false;
  selectedStudent = '';
  gradeScore = '';
  gradeAssignment = '';
  stats = {
    averageGrade: 0,
    totalStudents: 0,
    passedStudents: 0,
    failedStudents: 0
  };

  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    this.loadGrades();
    this.loadStudents();
  }

  loadGrades() {
    this.isLoading = true;
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.grades = [
        {
          id: '1',
          studentName: 'John Smith',
          assignment: 'Midterm Exam',
          score: 85
        },
        {
          id: '2',
          studentName: 'Jane Doe',
          assignment: 'Project Proposal',
          score: 92
        },
        {
          id: '3',
          studentName: 'Mike Johnson',
          assignment: 'Midterm Exam',
          score: 78
        }
      ];
      this.calculateStats();
      this.isLoading = false;
    }, 1000);
  }

  loadStudents() {
    // Mock data - replace with actual API call
    this.students = [
      { id: '1', name: 'John Smith' },
      { id: '2', name: 'Jane Doe' },
      { id: '3', name: 'Mike Johnson' }
    ];
  }

  calculateStats() {
    if (this.grades.length === 0) {
      this.stats = {
        averageGrade: 0,
        totalStudents: 0,
        passedStudents: 0,
        failedStudents: 0
      };
      return;
    }

    const totalScore = this.grades.reduce((sum, grade) => sum + grade.score, 0);
    this.stats.averageGrade = Math.round(totalScore / this.grades.length);
    this.stats.totalStudents = this.students.length;
    this.stats.passedStudents = this.grades.filter(g => g.score >= 60).length;
    this.stats.failedStudents = this.grades.filter(g => g.score < 60).length;
  }

  submitGrade() {
    if (!this.selectedStudent || !this.gradeScore || !this.gradeAssignment) {
      alert('Please fill in all fields');
      return;
    }

    const studentName = this.students.find(s => s.id === this.selectedStudent)?.name || 'Unknown';
    const newGrade = {
      id: Date.now().toString(),
      studentName: studentName,
      assignment: this.gradeAssignment,
      score: parseInt(this.gradeScore)
    };

    this.grades.push(newGrade);
    this.calculateStats();
    
    // Reset form
    this.selectedStudent = '';
    this.gradeScore = '';
    this.gradeAssignment = '';
    
    alert('✅ Grade submitted successfully!');
  }

  getLetterGrade(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  getGradeColor(score: number): string {
    if (score >= 90) return 'background: #27ae60; color: white;';
    if (score >= 80) return 'background: #3498db; color: white;';
    if (score >= 70) return 'background: #f39c12; color: white;';
    if (score >= 60) return 'background: #e67e22; color: white;';
    return 'background: #e74c3c; color: white;';
  }

  editGrade(grade: any) {
    alert(`✏️ Edit grade for ${grade.studentName}`);
  }

  deleteGrade(gradeId: string) {
    if (confirm('Are you sure you want to delete this grade?')) {
      this.grades = this.grades.filter(g => g.id !== gradeId);
      this.calculateStats();
      alert('🗑️ Grade deleted successfully!');
    }
  }

  goBack() {
    window.location.href = '/lecturer-dashboard';
  }
}

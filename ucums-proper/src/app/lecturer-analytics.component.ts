import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-lecturer-analytics',
  template: `
    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
        <h2 style="color: #2c3e50; margin: 0;">📊 Performance Analytics</h2>
        <button (click)="goBack()" style="background: #3498db; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;">
          ← Back to Dashboard
        </button>
      </div>
      
      <div *ngIf="isLoading" style="text-align: center; padding: 50px;">
        <p style="color: #7f8c8d; font-size: 1.2rem;">🔄 Loading analytics...</p>
      </div>

      <div *ngIf="!isLoading">
        <!-- Overview Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 40px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px; text-align: center;">
            <div style="font-size: 3rem;">📚</div>
            <div style="font-size: 2.5rem; font-weight: 700; margin: 10px 0;">{{analytics.totalCourses}}</div>
            <div>Total Courses</div>
          </div>
          
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 25px; border-radius: 12px; text-align: center;">
            <div style="font-size: 3rem;">👥</div>
            <div style="font-size: 2.5rem; font-weight: 700; margin: 10px 0;">{{analytics.totalStudents}}</div>
            <div>Total Students</div>
          </div>
          
          <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 25px; border-radius: 12px; text-align: center;">
            <div style="font-size: 3rem;">📈</div>
            <div style="font-size: 2.5rem; font-weight: 700; margin: 10px 0;">{{analytics.averageGrade}}%</div>
            <div>Average Grade</div>
          </div>
          
          <div style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; padding: 25px; border-radius: 12px; text-align: center;">
            <div style="font-size: 3rem;">✅</div>
            <div style="font-size: 2.5rem; font-weight: 700; margin: 10px 0;">{{analytics.passRate}}%</div>
            <div>Pass Rate</div>
          </div>
        </div>

        <!-- Grade Distribution -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
          <div style="background: #f8f9fa; padding: 25px; border-radius: 12px;">
            <h3 style="color: #2c3e50; margin-bottom: 20px;">📊 Grade Distribution</h3>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <div *ngFor="let grade of gradeDistribution" style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="width: 60px; font-weight: 600;">{{grade.grade}}</div>
                <div style="flex: 1; background: #e0e0e0; border-radius: 10px; height: 20px; margin: 0 15px; position: relative; overflow: hidden;">
                  <div [style]="getGradeBarStyle(grade.percentage)" style="height: 100%; border-radius: 10px; transition: width 0.5s ease;"></div>
                </div>
                <div style="width: 50px; text-align: right; font-weight: 600;">{{grade.count}}</div>
              </div>
            </div>
          </div>

          <!-- Course Performance -->
          <div style="background: #f8f9fa; padding: 25px; border-radius: 12px;">
            <h3 style="color: #2c3e50; margin-bottom: 20px;">📚 Course Performance</h3>
            <div style="background: white; border-radius: 8px; overflow: hidden;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #3498db; color: white;">
                    <th style="padding: 12px; text-align: left;">Course</th>
                    <th style="padding: 12px; text-align: center;">Students</th>
                    <th style="padding: 12px; text-align: center;">Average</th>
                    <th style="padding: 12px; text-align: center;">Pass Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let course of coursePerformance" style="border-bottom: 1px solid #eee;">
                    <td style="padding: 12px;">{{course.name}}</td>
                    <td style="padding: 12px; text-align: center;">{{course.students}}</td>
                    <td style="padding: 12px; text-align: center; font-weight: 600;">{{course.average}}%</td>
                    <td style="padding: 12px; text-align: center;">
                      <span [style]="getPassRateColor(course.passRate)" style="padding: 4px 8px; border-radius: 4px; font-weight: 600;">
                        {{course.passRate}}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 12px;">
          <h3 style="color: #2c3e50; margin-bottom: 20px;">📈 Recent Activity</h3>
          <div style="background: white; border-radius: 8px;">
            <div *ngFor="let activity of recentActivity; let i = index" style="padding: 15px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 15px;">
              <div style="font-size: 1.5rem;">{{getActivityIcon(activity.type)}}</div>
              <div style="flex: 1;">
                <div style="font-weight: 600; color: #2c3e50;">{{activity.title}}</div>
                <div style="color: #7f8c8d; font-size: 0.9rem;">{{activity.description}}</div>
              </div>
              <div style="color: #95a5a6; font-size: 0.8rem;">{{activity.time}}</div>
            </div>
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
  `]
})
export class LecturerAnalyticsComponent implements OnInit {
  isLoading = false;
  analytics = {
    totalCourses: 0,
    totalStudents: 0,
    averageGrade: 0,
    passRate: 0
  };
  gradeDistribution = [
    { grade: 'A (90-100)', count: 12, percentage: 30 },
    { grade: 'B (80-89)', count: 15, percentage: 37.5 },
    { grade: 'C (70-79)', count: 8, percentage: 20 },
    { grade: 'D (60-69)', count: 3, percentage: 7.5 },
    { grade: 'F (0-59)', count: 2, percentage: 5 }
  ];
  coursePerformance = [
    { name: 'LECT101', students: 25, average: 85, passRate: 92 },
    { name: 'CS102', students: 30, average: 78, passRate: 85 },
    { name: 'MATH201', students: 20, average: 82, passRate: 90 }
  ];
  recentActivity = [
    { type: 'grade', title: 'Graded Midterm Exam', description: '25 students graded', time: '2 hours ago' },
    { type: 'assignment', title: 'Created New Assignment', description: 'Project Proposal for CS102', time: '5 hours ago' },
    { type: 'student', title: 'New Student Enrollment', description: '3 students joined LECT101', time: '1 day ago' },
    { type: 'grade', title: 'Updated Grades', description: 'Project proposals graded', time: '2 days ago' }
  ];

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.isLoading = true;
    // Mock data - replace with actual API call
    setTimeout(() => {
      this.analytics = {
        totalCourses: 3,
        totalStudents: 75,
        averageGrade: 82,
        passRate: 89
      };
      this.isLoading = false;
    }, 1000);
  }

  getGradeBarStyle(percentage: number): string {
    const colors = ['#27ae60', '#3498db', '#f39c12', '#e67e22', '#e74c3c'];
    const colorIndex = percentage > 30 ? 0 : percentage > 20 ? 1 : percentage > 10 ? 2 : percentage > 5 ? 3 : 4;
    return `width: ${percentage}%; background: ${colors[colorIndex]};`;
  }

  getPassRateColor(rate: number): string {
    if (rate >= 90) return 'background: #27ae60; color: white;';
    if (rate >= 80) return 'background: #3498db; color: white;';
    if (rate >= 70) return 'background: #f39c12; color: white;';
    return 'background: #e74c3c; color: white;';
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      grade: '📊',
      assignment: '📝',
      student: '👥',
      course: '📚'
    };
    return icons[type] || '📈';
  }

  goBack() {
    window.location.href = '/lecturer-dashboard';
  }
}

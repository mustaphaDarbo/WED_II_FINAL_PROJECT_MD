import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-analytics',
  template: `
    <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; margin-bottom: 30px; text-align: center;">
        <h1 style="margin: 0 0 10px 0; font-size: 2.5rem;">📊 System Analytics</h1>
        <p style="margin: 0; font-size: 1.1rem; opacity: 0.9;">Real-time insights and statistics</p>
      </div>

      <div *ngIf="isLoading" style="text-align: center; padding: 50px;">
        <p style="color: #7f8c8d; font-size: 1.2rem;">🔄 Loading analytics data...</p>
      </div>

      <div *ngIf="!isLoading" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
        
        <!-- Users Statistics -->
        <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-left: 5px solid #3498db;">
          <h3 style="margin: 0 0 20px 0; color: #2c3e50; display: flex; align-items: center;">
            <span style="margin-right: 10px;">👥</span> Users Overview
          </h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 2rem; font-weight: bold; color: #3498db;">{{analytics.users?.total || 0}}</div>
              <div style="color: #7f8c8d; font-size: 0.9rem;">Total Users</div>
            </div>
            <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 2rem; font-weight: bold; color: #27ae60;">{{analytics.users?.active || 0}}</div>
              <div style="color: #7f8c8d; font-size: 0.9rem;">Active Users</div>
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #2c3e50;">Users by Role</h4>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="flex: 1; text-align: center; padding: 10px; background: #e8f5e8; border-radius: 6px; margin: 0 5px;">
                <div style="font-size: 1.5rem; font-weight: bold; color: #e74c3c;">{{analytics.users?.roles?.admin || 0}}</div>
                <div style="color: #7f8c8d; font-size: 0.8rem;">Admins</div>
              </div>
              <div style="flex: 1; text-align: center; padding: 10px; background: #e8f5e8; border-radius: 6px; margin: 0 5px;">
                <div style="font-size: 1.5rem; font-weight: bold; color: #f39c12;">{{analytics.users?.roles?.lecturer || 0}}</div>
                <div style="color: #7f8c8d; font-size: 0.8rem;">Lecturers</div>
              </div>
              <div style="flex: 1; text-align: center; padding: 10px; background: #e8f5e8; border-radius: 6px; margin: 0 5px;">
                <div style="font-size: 1.5rem; font-weight: bold; color: #3498db;">{{analytics.users?.roles?.student || 0}}</div>
                <div style="color: #7f8c8d; font-size: 0.8rem;">Students</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Articles Statistics -->
        <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-left: 5px solid #9b59b6;">
          <h3 style="margin: 0 0 20px 0; color: #2c3e50; display: flex; align-items: center;">
            <span style="margin-right: 10px;">📰</span> Articles Overview
          </h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 2rem; font-weight: bold; color: #9b59b6;">{{analytics.articles?.total || 0}}</div>
              <div style="color: #7f8c8d; font-size: 0.9rem;">Total Articles</div>
            </div>
            <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 2rem; font-weight: bold; color: #27ae60;">{{analytics.articles?.published || 0}}</div>
              <div style="color: #7f8c8d; font-size: 0.9rem;">Published</div>
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #2c3e50;">Articles by Category</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px;">
              <div *ngFor="let category of analytics.articles?.categories" style="background: #f4f1f2; padding: 10px; border-radius: 6px; text-align: center;">
                <div style="font-size: 1.2rem; font-weight: bold; color: #9b59b6;">{{category.count}}</div>
                <div style="color: #7f8c8d; font-size: 0.8rem;">{{category._id}}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Courses Statistics -->
        <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-left: 5px solid #27ae60;">
          <h3 style="margin: 0 0 20px 0; color: #2c3e50; display: flex; align-items: center;">
            <span style="margin-right: 10px;">📚</span> Courses Overview
          </h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 2rem; font-weight: bold; color: #27ae60;">{{analytics.courses?.total || 0}}</div>
              <div style="color: #7f8c8d; font-size: 0.9rem;">Total Courses</div>
            </div>
            <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 2rem; font-weight: bold; color: #f39c12;">{{analytics.courses?.active || 0}}</div>
              <div style="color: #7f8c8d; font-size: 0.9rem;">Active Courses</div>
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #2c3e50;">Courses by Semester</h4>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="flex: 1; text-align: center; padding: 10px; background: #e8f5e8; border-radius: 6px; margin: 0 5px;">
                <div style="font-size: 1.3rem; font-weight: bold; color: #27ae60;">{{analytics.courses?.bySemester?.first || 0}}</div>
                <div style="color: #7f8c8d; font-size: 0.8rem;">First</div>
              </div>
              <div style="flex: 1; text-align: center; padding: 10px; background: #e8f5e8; border-radius: 6px; margin: 0 5px;">
                <div style="font-size: 1.3rem; font-weight: bold; color: #f39c12;">{{analytics.courses?.bySemester?.second || 0}}</div>
                <div style="color: #7f8c8d; font-size: 0.8rem;">Second</div>
              </div>
              <div style="flex: 1; text-align: center; padding: 10px; background: #e8f5e8; border-radius: 6px; margin: 0 5px;">
                <div style="font-size: 1.3rem; font-weight: bold; color: #e74c3c;">{{analytics.courses?.bySemester?.summer || 0}}</div>
                <div style="color: #7f8c8d; font-size: 0.8rem;">Summer</div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Health -->
        <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border-left: 5px solid #e74c3c;">
          <h3 style="margin: 0 0 20px 0; color: #2c3e50; display: flex; align-items: center;">
            <span style="margin-right: 10px;">⚡</span> System Health
          </h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 2rem; font-weight: bold; color: #27ae60;">✅</div>
              <div style="color: #7f8c8d; font-size: 0.9rem;">API Status</div>
            </div>
            <div style="background: #ecf0f1; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 2rem; font-weight: bold; color: #3498db;">{{analytics.system?.uptime || 'N/A'}}</div>
              <div style="color: #7f8c8d; font-size: 0.9rem;">Uptime</div>
            </div>
          </div>

          <div style="margin-top: 15px; padding: 15px; background: #d4edda; border-radius: 8px; text-align: center;">
            <div style="color: #155724; font-weight: 500;">Last Updated: {{lastUpdated}}</div>
          </div>
        </div>

      </div>

      <!-- Recent Activity -->
      <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-top: 20px;">
        <h3 style="margin: 0 0 20px 0; color: #2c3e50; display: flex; align-items: center;">
          <span style="margin-right: 10px;">🕐</span> Recent Activity
        </h3>
        
        <div style="display: grid; gap: 10px;">
          <div *ngFor="let activity of analytics.recentActivity" style="display: flex; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; border-left: 3px solid #3498db;">
            <div style="margin-right: 15px; font-size: 1.5rem;">{{getActivityIcon(activity.type)}}</div>
            <div style="flex: 1;">
              <div style="font-weight: 500; color: #2c3e50;">{{activity.description}}</div>
              <div style="color: #7f8c8d; font-size: 0.8rem;">{{activity.timestamp}}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    @media (max-width: 768px) {
      div[style*="grid-template-columns"] {
        grid-template-columns: 1fr !important;
      }
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  analytics: any = {};
  isLoading = false;
  lastUpdated = new Date();

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.isLoading = true;
    this.databaseService.getAnalytics().subscribe({
      next: (response: any) => {
        this.analytics = response.data || {};
        this.lastUpdated = new Date();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading analytics:', error);
        this.isLoading = false;
      }
    });
  }

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'user_created': '👤',
      'user_deleted': '🗑️',
      'course_created': '📚',
      'course_updated': '✏️',
      'course_deleted': '🗑️',
      'article_created': '📰',
      'article_updated': '✏️',
      'article_deleted': '🗑️',
      'login': '🔐',
      'system': '⚙️'
    };
    return icons[type] || '📋';
  }
}

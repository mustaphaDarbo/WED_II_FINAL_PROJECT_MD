import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-assignment-management',
  template: `
    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
        <h2 style="color: #2c3e50; margin: 0;">📝 Assignment Management</h2>
        <button (click)="goBack()" style="background: #3498db; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer;">
          ← Back to Dashboard
        </button>
      </div>
      
      <div *ngIf="isLoading" style="text-align: center; padding: 50px;">
        <p style="color: #7f8c8d; font-size: 1.2rem;">🔄 Loading assignments...</p>
      </div>

      <div *ngIf="!isLoading">
        <!-- Create New Assignment -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
          <h3 style="color: #2c3e50; margin-bottom: 20px;">➕ Create New Assignment</h3>
          <div style="display: grid; gap: 15px;">
            <input 
              [(ngModel)]="newAssignment.title" 
              placeholder="Assignment Title" 
              style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
            <textarea 
              [(ngModel)]="newAssignment.description" 
              placeholder="Assignment Description" 
              rows="4"
              style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; resize: vertical;">
            </textarea>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <input 
                [(ngModel)]="newAssignment.dueDate" 
                type="date" 
                style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
              <input 
                [(ngModel)]="newAssignment.totalPoints" 
                type="number" 
                placeholder="Total Points" 
                style="padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem;">
            </div>
            <button 
              (click)="createAssignment()" 
              [disabled]="!newAssignment.title || !newAssignment.description"
              style="background: #27ae60; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500;">
              📝 Create Assignment
            </button>
          </div>
        </div>

        <!-- Existing Assignments -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 12px;">
          <h3 style="color: #2c3e50; margin-bottom: 20px;">📋 Current Assignments</h3>
          <div *ngIf="assignments.length === 0" style="text-align: center; padding: 40px; background: white; border-radius: 8px;">
            <div style="font-size: 3rem; margin-bottom: 15px;">📝</div>
            <p style="color: #7f8c8d; font-size: 1.1rem;">No assignments created yet.</p>
          </div>
          
          <div *ngFor="let assignment of assignments" style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #9b59b6;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
              <div style="flex: 1;">
                <h4 style="color: #2c3e50; margin: 0 0 8px 0; font-size: 1.1rem;">{{assignment.title}}</h4>
                <p style="color: #7f8c8d; margin: 0 0 10px 0; line-height: 1.5;">{{assignment.description}}</p>
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 6px;">
              <div style="text-align: center;">
                <div style="color: #e67e22; font-size: 1.2rem; font-weight: 700;">{{assignment.totalPoints || 100}}</div>
                <div style="color: #7f8c8d; font-size: 0.8rem;">Points</div>
              </div>
              <div style="text-align: center;">
                <div style="color: #3498db; font-size: 1.2rem; font-weight: 700;">{{assignment.dueDate || 'Not set'}}</div>
                <div style="color: #7f8c8d; font-size: 0.8rem;">Due Date</div>
              </div>
              <div style="text-align: center;">
                <div style="color: #27ae60; font-size: 1.2rem; font-weight: 700;">{{assignment.submissions || 0}}</div>
                <div style="color: #7f8c8d; font-size: 0.8rem;">Submissions</div>
              </div>
            </div>
            
            <div style="display: flex; gap: 10px;">
              <button (click)="viewSubmissions(assignment._id)" style="background: #3498db; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">
                📄 View Submissions
              </button>
              <button (click)="editAssignment(assignment)" style="background: #f39c12; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">
                ✏️ Edit
              </button>
              <button (click)="deleteAssignment(assignment._id)" style="background: #e74c3c; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    button:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    input, textarea {
      transition: border-color 0.3s ease;
    }
    input:focus, textarea:focus {
      outline: none;
      border-color: #3498db;
    }
  `]
})
export class AssignmentManagementComponent implements OnInit {
  courseId: string = '';
  assignments: any[] = [];
  isLoading = false;
  newAssignment = {
    title: '',
    description: '',
    dueDate: '',
    totalPoints: 100
  };

  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    this.loadAssignments();
  }

  loadAssignments() {
    this.isLoading = true;
    // Mock data for now - replace with actual API call
    setTimeout(() => {
      this.assignments = [
        {
          _id: '1',
          title: 'Midterm Exam',
          description: 'Complete midterm examination covering chapters 1-5',
          totalPoints: 100,
          dueDate: '2024-02-15',
          submissions: 12
        },
        {
          _id: '2',
          title: 'Project Proposal',
          description: 'Submit a detailed proposal for your final project',
          totalPoints: 50,
          dueDate: '2024-02-10',
          submissions: 8
        }
      ];
      this.isLoading = false;
    }, 1000);
  }

  createAssignment() {
    if (!this.newAssignment.title || !this.newAssignment.description) {
      alert('Please fill in all required fields');
      return;
    }

    // Mock creation - replace with actual API call
    const assignment = {
      _id: Date.now().toString(),
      ...this.newAssignment,
      submissions: 0
    };
    
    this.assignments.unshift(assignment);
    this.newAssignment = {
      title: '',
      description: '',
      dueDate: '',
      totalPoints: 100
    };
    
    alert('✅ Assignment created successfully!');
  }

  viewSubmissions(assignmentId: string) {
    alert(`📄 Viewing submissions for assignment ${assignmentId}`);
  }

  editAssignment(assignment: any) {
    this.newAssignment = { ...assignment };
    alert('✏️ Edit functionality coming soon!');
  }

  deleteAssignment(assignmentId: string) {
    if (confirm('Are you sure you want to delete this assignment?')) {
      this.assignments = this.assignments.filter(a => a._id !== assignmentId);
      alert('🗑️ Assignment deleted successfully!');
    }
  }

  goBack() {
    window.location.href = '/lecturer-dashboard';
  }
}

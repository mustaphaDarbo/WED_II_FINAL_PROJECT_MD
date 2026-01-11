import { Component } from '@angular/core';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-course-management',
  template: `
    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 30px;">
      <h2 style="color: #2c3e50; margin-bottom: 30px;">📚 Course Management</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
        <!-- Create Course Form -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 12px;">
          <h3 style="color: #2c3e50; margin: 0 0 20px 0;">📝 Create New Course</h3>
          
          <div *ngIf="message" [style]="messageStyle" style="padding: 12px; border-radius: 6px; margin-bottom: 20px;">
            <p [innerHTML]="message"></p>
          </div>
          
          <form (ngSubmit)="createCourse()">
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📚 Course Code:</label>
              <input type="text" [(ngModel)]="newCourse.courseCode" name="courseCode" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" placeholder="e.g., CS101" required>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📚 Course Title:</label>
              <input type="text" [(ngModel)]="newCourse.title" name="title" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" placeholder="Enter course title" required>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📝 Description:</label>
              <textarea [(ngModel)]="newCourse.description" name="description" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem; min-height: 100px;" placeholder="Enter course description" required></textarea>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">👨‍🏫 Lecturer:</label>
              <select [(ngModel)]="newCourse.lecturerId" name="lecturerId" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" required>
                <option value="">Select Lecturer</option>
                <option *ngFor="let lecturer of lecturers" [value]="lecturer._id">
                  {{lecturer.fullName}} ({{lecturer.email}})
                </option>
              </select>
              <small style="color: #666; font-size: 0.8rem;">Lecturer ID will be automatically assigned</small>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📊 Credit Units:</label>
              <input type="number" [(ngModel)]="newCourse.creditUnits" name="creditUnits" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" placeholder="Enter credits" min="1" required>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📅 Semester:</label>
              <select [(ngModel)]="newCourse.semester" name="semester" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" required>
                <option value="">Select Semester</option>
                <option value="first">First</option>
                <option value="second">Second</option>
                <option value="summer">Summer</option>
              </select>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📅 Academic Year:</label>
              <input type="text" [(ngModel)]="newCourse.academicYear" name="academicYear" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" placeholder="e.g., 2024/2025" required>
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">👥 Max Students:</label>
              <input type="number" [(ngModel)]="newCourse.maxStudents" name="maxStudents" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" placeholder="Enter max students" min="1" required>
            </div>
            
            <button type="submit" [disabled]="isCreating" style="background: #27ae60; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; width: 100%;">
              {{isCreating ? '🔄 Creating...' : '➕ Create Course'}}
            </button>
          </form>
        </div>
        
        <!-- Edit Course Form -->
        <div *ngIf="isEditing" style="background: #fff3cd; padding: 25px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #ffeaa7;">
          <h3 style="color: #856404; margin: 0 0 20px 0;">✏️ Edit Course</h3>
          <form (ngSubmit)="updateCourse()">
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📚 Course Code:</label>
              <input type="text" [(ngModel)]="editingCourse.courseCode" name="editCourseCode" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" required>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📚 Course Title:</label>
              <input type="text" [(ngModel)]="editingCourse.title" name="editTitle" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" required>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📝 Description:</label>
              <textarea [(ngModel)]="editingCourse.description" name="editDescription" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem; min-height: 100px;" required></textarea>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">👨‍🏫 Lecturer:</label>
              <select [(ngModel)]="editingCourse.lecturerId" name="editLecturerId" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" required>
                <option value="">Select Lecturer</option>
                <option *ngFor="let lecturer of lecturers" [value]="lecturer._id" [selected]="lecturer._id === (editingCourse.lecturerId?._id || editingCourse.lecturerId)">
                  {{lecturer.fullName}} ({{lecturer.email}})
                </option>
              </select>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📊 Credit Units:</label>
              <input type="number" [(ngModel)]="editingCourse.creditUnits" name="editCreditUnits" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" min="1" required>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📅 Semester:</label>
              <select [(ngModel)]="editingCourse.semester" name="editSemester" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" required>
                <option value="">Select Semester</option>
                <option value="first">First</option>
                <option value="second">Second</option>
                <option value="summer">Summer</option>
              </select>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📅 Academic Year:</label>
              <input type="text" [(ngModel)]="editingCourse.academicYear" name="editAcademicYear" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" placeholder="e.g., 2024/2025" required>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">👥 Max Students:</label>
              <input type="number" [(ngModel)]="editingCourse.maxStudents" name="editMaxStudents" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" min="1" required>
            </div>
            
            <div style="display: flex; gap: 10px;">
              <button type="submit" style="background: #27ae60; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; flex: 1;">
                💾 Save Changes
              </button>
              <button type="button" (click)="cancelEdit()" style="background: #e74c3c; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; flex: 1;">
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
        
        <!-- Courses List -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 12px;">
          <h3 style="color: #2c3e50; margin: 0 0 20px 0;">📋 Existing Courses</h3>
          
          <div *ngIf="isLoading" style="text-align: center; padding: 20px;">
            <p style="color: #7f8c8d;">🔄 Loading courses...</p>
          </div>
          
          <div *ngIf="!isLoading" style="max-height: 400px; overflow-y: auto;">
            <div *ngFor="let course of courses; let i = index" style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #27ae60;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 5px 0; color: #2c3e50;">{{course.courseCode}} - {{course.title}}</h4>
                  <p style="margin: 0 0 5px 0; color: #7f8c8d; font-size: 0.9rem;">👨‍🏫 {{course.lecturerId?.fullName || 'N/A'}}</p>
                  <p style="margin: 0 0 5px 0; color: #7f8c8d; font-size: 0.8rem;">📊 {{course.creditUnits}} credits</p>
                  <p style="margin: 0 0 5px 0; color: #7f8c8d; font-size: 0.8rem;">📅 {{course.semester}} semester</p>
                  <p style="margin: 0 0 10px 0; color: #2c3e50; font-size: 0.9rem; line-height: 1.4;">{{course.description | slice:0:100}}...</p>
                </div>
                <div style="display: flex; flex-direction: column; gap: 5px;">
                  <button (click)="editCourse(course)" style="background: #3498db; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                    ✏️ Edit
                  </button>
                  <button (click)="deleteCourse(course._id || '')" [disabled]="isDeleting === course._id" style="background: #e74c3c; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                    {{isDeleting === course._id ? '🔄' : '🗑️'}} Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    input:focus, select:focus, textarea:focus {
      outline: none;
      border-color: #3498db;
    }
    button:hover {
      opacity: 0.9;
    }
    button:disabled {
      background: #95a5a6;
      cursor: not-allowed;
    }
  `]
})
export class CourseManagementComponent {
  courses: any[] = [];
  lecturers: any[] = [];
  newCourse = {
    courseCode: '',
    title: '',
    description: '',
    lecturerId: '696380545e906b0cbf32f79a', // Default to Supperadmin
    creditUnits: null,
    semester: '',
    academicYear: '',
    maxStudents: 50
  };
  editingCourse: any = null;
  message = '';
  messageStyle = '';
  isLoading = false;
  isCreating = false;
  isDeleting: string | null = null;
  isEditing: string | null = null;
  
  constructor(private databaseService: DatabaseService) {
    this.loadCourses();
    this.loadLecturers();
  }
  
  loadCourses() {
    this.isLoading = true;
    this.databaseService.getCourses().subscribe({
      next: (response: any) => {
        this.courses = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.isLoading = false;
        this.showMessage('❌ Error loading courses. Please check your connection.', 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
      }
    });
  }
  
  loadLecturers() {
    this.databaseService.getUsers().subscribe({
      next: (response: any) => {
        this.lecturers = response.users?.filter((user: any) => user.role === 'lecturer') || [];
      },
      error: (error) => {
        console.error('Error loading lecturers:', error);
      }
    });
  }
  
  createCourse() {
    if (!this.newCourse.courseCode || !this.newCourse.title || !this.newCourse.description || !this.newCourse.lecturerId || !this.newCourse.creditUnits || !this.newCourse.semester || !this.newCourse.academicYear) {
      this.showMessage('❌ Please fill in all fields. Make sure to select a lecturer from the dropdown.', 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
      return;
    }
    
    this.isCreating = true;
    
    this.databaseService.createCourse(this.newCourse).subscribe({
      next: (response) => {
        this.isCreating = false;
        if (response && response.success) {
          this.showMessage(`✅ Course "${this.newCourse.courseCode}" created successfully!`, 'color: #155724; background: #d4edda; border: 1px solid #c3e6cb;');
          
          // Reset form
          this.newCourse = {
            courseCode: '',
            title: '',
            description: '',
            lecturerId: '',
            creditUnits: null,
            semester: '',
            academicYear: '',
            maxStudents: 50
          };
          
          // Reload courses list
          this.loadCourses();
        } else {
          this.showMessage(`❌ Error creating course: ${response.message || 'Unknown error'}`, 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
        }
      },
      error: (error) => {
        this.isCreating = false;
        this.showMessage(`❌ Error creating course: ${error.message || 'Unknown error'}`, 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
      }
    });
  }
  
  editCourse(course: any) {
    this.editingCourse = { ...course };
    // Handle lecturer ID - if it's an object, get the _id
    if (course.lecturerId && typeof course.lecturerId === 'object') {
      this.editingCourse.lecturerId = course.lecturerId._id;
    }
    this.isEditing = course._id;
  }
  
  updateCourse() {
    if (!this.editingCourse) return;
    
    this.databaseService.updateCourse(this.editingCourse._id, this.editingCourse).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.showMessage(`✅ Course "${this.editingCourse.courseCode}" updated successfully!`, 'color: #155724; background: #d4edda; border: 1px solid #c3e6cb;');
          this.editingCourse = null;
          this.isEditing = null;
          this.loadCourses();
        } else {
          this.showMessage(`❌ Error updating course: ${response.message || 'Unknown error'}`, 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
        }
      },
      error: (error) => {
        this.showMessage(`❌ Error updating course: ${error.message || 'Unknown error'}`, 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
      }
    });
  }
  
  cancelEdit() {
    this.editingCourse = null;
    this.isEditing = null;
  }
  
  deleteCourse(courseId: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.isDeleting = courseId;
      
      this.databaseService.deleteCourse(courseId).subscribe({
        next: () => {
          this.isDeleting = null;
          this.showMessage('✅ Course deleted successfully!', 'color: #155724; background: #d4edda; border: 1px solid #c3e6cb;');
          this.loadCourses();
        },
        error: (error) => {
          this.isDeleting = null;
          this.showMessage('❌ Failed to delete course', 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
        }
      });
    }
  }
  
  showMessage(msg: string, style: string) {
    this.message = msg;
    this.messageStyle = style;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}

import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-student-profile',
  template: `
    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
      <h3 style="color: #2c3e50; margin-bottom: 25px;">👤 My Profile</h3>
      
      <div *ngIf="isLoading" style="text-align: center; padding: 50px;">
        <p style="color: #7f8c8d; font-size: 1.2rem;">🔄 Loading profile...</p>
      </div>

      <div *ngIf="!isLoading" style="display: grid; grid-template-columns: 1fr 2fr; gap: 30px;">
        <!-- Profile Picture Section -->
        <div style="text-align: center;">
          <div 
            *ngIf="profile.profileImage" 
            style="width: 200px; height: 200px; border-radius: 50%; margin: 0 auto 20px; overflow: hidden; border: 4px solid #3498db;">
            <img 
              [src]="'https://wed-ii-final-project-md.onrender.com' + profile.profileImage" 
              [alt]="profile.fullName"
              style="width: 100%; height: 100%; object-fit: cover;"
              (error)="profile.profileImage = ''">
          </div>
          <div 
            *ngIf="!profile.profileImage"
            style="background: #ecf0f1; width: 200px; height: 200px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 4rem; color: #7f8c8d;">
            {{profile.fullName?.charAt(0) || 'S'}}
          </div>
          <input 
            type="file" 
            (change)="onProfilePictureChange($event)" 
            accept="image/*" 
            style="display: none;" 
            #profilePictureInput>
          <button 
            (click)="profilePictureInput.click()" 
            style="background: #3498db; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem;">
            📷 Upload Photo
          </button>
        </div>

        <!-- Profile Information -->
        <div>
          <form (ngSubmit)="updateProfile()">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 500;">Full Name</label>
                <input 
                  type="text" 
                  [(ngModel)]="profile.fullName" 
                  name="fullName"
                  style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" 
                  required>
              </div>
              <div>
                <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 500;">Email</label>
                <input 
                  type="email" 
                  [(ngModel)]="profile.email" 
                  name="email"
                  style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" 
                  disabled>
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 500;">Phone Number</label>
              <input 
                type="tel" 
                [(ngModel)]="profile.phoneNumber" 
                name="phoneNumber"
                style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" 
                placeholder="+1234567890">
            </div>

            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 500;">Address</label>
              <textarea 
                [(ngModel)]="profile.address" 
                name="address"
                style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem; min-height: 100px;" 
                placeholder="Enter your address">
              </textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 500;">Student ID</label>
                <input 
                  type="text" 
                  [(ngModel)]="profile.studentId" 
                  name="studentId"
                  style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" 
                  placeholder="Enter student ID">
              </div>
              <div>
                <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 500;">Date of Birth</label>
                <input 
                  type="date" 
                  [(ngModel)]="profile.dateOfBirth" 
                  name="dateOfBirth"
                  style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;">
              </div>
            </div>

            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; color: #2c3e50; font-weight: 500;">Bio</label>
              <textarea 
                [(ngModel)]="profile.bio" 
                name="bio"
                style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem; min-height: 100px;" 
                placeholder="Tell us about yourself">
              </textarea>
            </div>

            <div style="display: flex; gap: 15px;">
              <button 
                type="submit" 
                [disabled]="isUpdating"
                style="background: #27ae60; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500;">
                {{isUpdating ? '🔄 Updating...' : '💾 Update Profile'}}
              </button>
              <button 
                type="button" 
                (click)="goBack()"
                style="background: #95a5a6; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500;">
                ← Back
              </button>
            </div>
          </form>
        </div>
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
    input:focus, textarea:focus {
      border-color: #3498db;
      outline: none;
    }
  `]
})
export class StudentProfileComponent implements OnInit {
  profile: any = {};
  isLoading = false;
  isUpdating = false;

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    this.databaseService.getCurrentUserProfile().subscribe({
      next: (response: any) => {
        this.profile = response.data || {};
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading profile:', error);
        this.isLoading = false;
      }
    });
  }

  onProfilePictureChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('❌ Only image files are allowed');
        return;
      }

      this.uploadProfileImage(file);
    }
  }

  uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append('profileImage', file);

    this.databaseService.uploadProfileImage(formData).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('✅ Profile picture uploaded successfully!');
          this.profile.profileImage = response.profileImage;
          // Update stored user data
          const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, profileImage: response.profileImage }));
        } else {
          alert('❌ Failed to upload profile picture: ' + response.message);
        }
      },
      error: (error: any) => {
        alert('❌ Error uploading profile picture: ' + error.message);
      }
    });
  }

  updateProfile() {
    this.isUpdating = true;
    
    this.databaseService.updateUser('', this.profile).subscribe({
      next: (response: any) => {
        if (response.success) {
          alert('✅ Profile updated successfully!');
          // Update stored user data
          const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
          localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, ...this.profile }));
        } else {
          alert('❌ Failed to update profile: ' + response.message);
        }
        this.isUpdating = false;
      },
      error: (error: any) => {
        alert('❌ Error updating profile: ' + error.message);
        this.isUpdating = false;
      }
    });
  }

  goBack() {
    window.location.href = '/student-dashboard';
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0; margin: 0;">
      <!-- Hero Section -->
      <div style="text-align: center; padding: 80px 20px; color: white;">
        <h1 style="font-size: 3.5rem; margin: 0 0 20px 0; font-weight: 700; text-shadow: 0 4px 8px rgba(0,0,0,0.3);">
          🎓 Welcome to UCUMS
        </h1>
        <p style="font-size: 1.4rem; margin: 0 0 40px 0; opacity: 0.95; max-width: 600px; margin-left: auto; margin-right: auto;">
          University Content Management System - Empowering Education Through Technology
        </p>
        
        <!-- Hero Content with Image and Button -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 40px; margin-top: 20px;">
          <!-- University Image -->
          <div style="background: white; padding: 20px; border-radius: 15px; box-shadow: 0 8px 25px rgba(0,0,0,0.2);">
            <img src="/assets/university-image.jpeg" alt="University" style="width: 200px; height: 200px; border-radius: 10px; object-fit: cover;" (error)="handleImageError()" (load)="handleImageLoad()">
            <div style="color: #2c3e50; font-size: 1.1rem; font-weight: 600; margin-top: 15px;">Modern Education</div>
            <div *ngIf="imageError" style="color: #e74c3c; font-size: 0.9rem; margin-top: 5px;">Image failed to load</div>
          </div>
          
          <!-- Get Started Button -->
          <button (click)="goToLogin()" style="background: white; color: #667eea; padding: 20px 50px; border: none; border-radius: 50px; font-size: 1.3rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(0,0,0,0.2);">
            🚀 Get Started
          </button>
        </div>
      </div>
      
      <!-- Features Section -->
      <div style="background: white; padding: 80px 20px;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <h2 style="text-align: center; color: #2c3e50; font-size: 2.5rem; margin: 0 0 60px 0; font-weight: 700;">
            Choose Your Portal
          </h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 40px;">
            <!-- Admin Portal -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; border-radius: 20px; text-align: center; transition: transform 0.3s ease; box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);">
              <div style="font-size: 5rem; margin-bottom: 20px;">👥</div>
              <h3 style="margin: 0 0 15px 0; font-size: 1.8rem; font-weight: 600;">Admin Portal</h3>
              <p style="margin: 0 0 25px 0; opacity: 0.9; font-size: 1.1rem; line-height: 1.6;">
                Complete system control, user management, course administration, and comprehensive analytics
              </p>
              <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; font-size: 0.9rem;">
                <strong>Features:</strong> User Management • Course Control • System Analytics
              </div>
            </div>
            
            <!-- Student Portal -->
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 40px; border-radius: 20px; text-align: center; transition: transform 0.3s ease; box-shadow: 0 15px 35px rgba(240, 147, 251, 0.3);">
              <div style="font-size: 5rem; margin-bottom: 20px;">👨‍🎓</div>
              <h3 style="margin: 0 0 15px 0; font-size: 1.8rem; font-weight: 600;">Student Portal</h3>
              <p style="margin: 0 0 25px 0; opacity: 0.9; font-size: 1.1rem; line-height: 1.6;">
                Course registration, academic resources, assignment tracking, and performance monitoring
              </p>
              <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; font-size: 0.9rem;">
                <strong>Features:</strong> Course Registration • Grade Tracking • Resource Access
              </div>
            </div>
            
            <!-- Lecturer Portal -->
            <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 40px; border-radius: 20px; text-align: center; transition: transform 0.3s ease; box-shadow: 0 15px 35px rgba(79, 172, 254, 0.3);">
              <div style="font-size: 5rem; margin-bottom: 20px;">👨‍🏫</div>
              <h3 style="margin: 0 0 15px 0; font-size: 1.8rem; font-weight: 600;">Lecturer Portal</h3>
              <p style="margin: 0 0 25px 0; opacity: 0.9; font-size: 1.1rem; line-height: 1.6;">
                Course management, student grading, content creation, and performance analytics
              </p>
              <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; font-size: 0.9rem;">
                <strong>Features:</strong> Course Management • Student Grading • Content Creation
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Statistics Section -->
      <div style="background: #f8f9fa; padding: 60px 20px;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <h2 style="text-align: center; color: #2c3e50; font-size: 2.5rem; margin: 0 0 50px 0; font-weight: 700;">
            System Statistics
          </h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
            <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
              <div style="font-size: 3rem; margin-bottom: 15px;">👥</div>
              <div style="font-size: 2.5rem; font-weight: 700; color: #667eea; margin-bottom: 10px;">500+</div>
              <p style="color: #7f8c8d; margin: 0; font-size: 1.1rem;">Active Users</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
              <div style="font-size: 3rem; margin-bottom: 15px;">📚</div>
              <div style="font-size: 2.5rem; font-weight: 700; color: #f093fb; margin-bottom: 10px;">50+</div>
              <p style="color: #7f8c8d; margin: 0; font-size: 1.1rem;">Courses Available</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
              <div style="font-size: 3rem; margin-bottom: 15px;">📰</div>
              <div style="font-size: 2.5rem; font-weight: 700; color: #4facfe; margin-bottom: 10px;">1000+</div>
              <p style="color: #7f8c8d; margin: 0; font-size: 1.1rem;">Articles Published</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 15px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
              <div style="font-size: 3rem; margin-bottom: 15px;">🏆</div>
              <div style="font-size: 2.5rem; font-weight: 700; color: #27ae60; margin-bottom: 10px;">98%</div>
              <p style="color: #7f8c8d; margin: 0; font-size: 1.1rem;">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background: #2c3e50; color: white; padding: 40px 20px; text-align: center;">
        <p style="margin: 0 0 15px 0; font-size: 1.2rem; font-weight: 600;">
          🎓 University Content Management System
        </p>
        <p style="margin: 0; opacity: 0.8; font-size: 1rem;">
          Empowering education through innovative technology solutions
        </p>
      </div>
    </div>
  `,
  styles: [`
    div:hover {
      transform: translateY(-10px);
    }
    button:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(0,0,0,0.3);
    }
  `]
})
export class HomeComponent {
  imageError = false;

  goToLogin() {
    window.location.href = '/login';
  }

  handleImageError(): void {
    this.imageError = true;
    console.error('Image failed to load');
  }

  handleImageLoad(): void {
    this.imageError = false;
    console.log('Image loaded successfully');
  }
}

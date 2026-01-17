import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-home',
  template: `
    <div style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0; margin: 0;">
      <!-- Hero Section -->
      <div style="text-align: center; padding: 60px 20px; color: white;">
        <h1 style="font-size: clamp(2rem, 5vw, 3.5rem); margin: 0 0 20px 0; font-weight: 700; text-shadow: 0 4px 8px rgba(0,0,0,0.3);">
          🎓 Welcome to UCUMS
        </h1>
        <p style="font-size: clamp(1rem, 2.5vw, 1.4rem); margin: 0 0 40px 0; opacity: 0.95; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6;">
          University Content Management System - Empowering Education Through Technology
        </p>
        
        <!-- Hero Content with Image and Button -->
        <div style="display: flex; align-items: center; justify-content: center; gap: clamp(20px, 5vw, 40px); margin-top: 20px; flex-wrap: wrap;">
          <!-- University Image -->
          <div style="background: white; padding: clamp(15px, 3vw, 20px); border-radius: 15px; box-shadow: 0 8px 25px rgba(0,0,0,0.2); flex: 1; min-width: 200px; max-width: 300px;">
            <img src="/assets/university-image.jpeg" alt="University" style="width: 100%; height: auto; max-height: 200px; border-radius: 10px; object-fit: cover;" (error)="handleImageError()" (load)="handleImageLoad()">
            <div style="color: #2c3e50; font-size: clamp(0.9rem, 2vw, 1.1rem); font-weight: 600; margin-top: 15px;">Modern Education</div>
            <div *ngIf="imageError" style="color: #e74c3c; font-size: 0.9rem; margin-top: 5px;">Image failed to load</div>
          </div>
          
          <!-- Get Started Button -->
          <button (click)="goToLogin()" style="background: white; color: #667eea; padding: clamp(15px, 3vw, 20px) clamp(30px, 6vw, 50px); border: none; border-radius: 50px; font-size: clamp(1rem, 2.5vw, 1.3rem); font-weight: 600; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 8px 25px rgba(0,0,0,0.2); flex: 1; min-width: 150px; max-width: 250px;">
            🚀 Get Started
          </button>
        </div>
      </div>
      
      <!-- Features Section -->
      <div style="background: white; padding: clamp(40px, 8vw, 80px) 20px;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <h2 style="text-align: center; color: #2c3e50; font-size: clamp(1.5rem, 4vw, 2.5rem); margin: 0 0 clamp(30px, 6vw, 60px) 0; font-weight: 700;">
            Choose Your Portal
          </h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: clamp(20px, 4vw, 40px);">
            <!-- Admin Portal -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: clamp(25px, 5vw, 40px); border-radius: 20px; text-align: center; transition: transform 0.3s ease; box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);">
              <div style="font-size: clamp(3rem, 8vw, 5rem); margin-bottom: 20px;">👥</div>
              <h3 style="margin: 0 0 15px 0; font-size: clamp(1.3rem, 3.5vw, 1.8rem); font-weight: 600;">Admin Portal</h3>
              <p style="margin: 0 0 25px 0; opacity: 0.9; font-size: clamp(0.9rem, 2.5vw, 1.1rem); line-height: 1.6;">
                Complete system control, user management, course administration, and comprehensive analytics
              </p>
              <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; font-size: clamp(0.8rem, 2vw, 0.9rem);">
                <strong>Features:</strong> User Management • Course Control • System Analytics
              </div>
            </div>
            
            <!-- Student Portal -->
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: clamp(25px, 5vw, 40px); border-radius: 20px; text-align: center; transition: transform 0.3s ease; box-shadow: 0 15px 35px rgba(240, 147, 251, 0.3);">
              <div style="font-size: clamp(3rem, 8vw, 5rem); margin-bottom: 20px;">👨‍🎓</div>
              <h3 style="margin: 0 0 15px 0; font-size: clamp(1.3rem, 3.5vw, 1.8rem); font-weight: 600;">Student Portal</h3>
              <p style="margin: 0 0 25px 0; opacity: 0.9; font-size: clamp(0.9rem, 2.5vw, 1.1rem); line-height: 1.6;">
                Course registration, academic resources, assignment tracking, and performance monitoring
              </p>
              <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; font-size: clamp(0.8rem, 2vw, 0.9rem);">
                <strong>Features:</strong> Course Registration • Grades • Assignments • Resources
              </div>
            </div>
            
            <!-- Lecturer Portal -->
            <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: clamp(25px, 5vw, 40px); border-radius: 20px; text-align: center; transition: transform 0.3s ease; box-shadow: 0 15px 35px rgba(79, 172, 254, 0.3);">
              <div style="font-size: clamp(3rem, 8vw, 5rem); margin-bottom: 20px;">👨‍🏫</div>
              <h3 style="margin: 0 0 15px 0; font-size: clamp(1.3rem, 3.5vw, 1.8rem); font-weight: 600;">Lecturer Portal</h3>
              <p style="margin: 0 0 25px 0; opacity: 0.9; font-size: clamp(0.9rem, 2.5vw, 1.1rem); line-height: 1.6;">
                Course management, student assessment, grade submission, and academic analytics
              </p>
              <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; font-size: clamp(0.8rem, 2vw, 0.9rem);">
                <strong>Features:</strong> Course Management • Grading • Analytics • Student Tracking
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Statistics Section -->
      <div style="background: #f8f9fa; padding: clamp(30px, 6vw, 60px) 20px;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <h2 style="text-align: center; color: #2c3e50; font-size: clamp(1.5rem, 4vw, 2.5rem); margin: 0 0 clamp(25px, 5vw, 50px) 0; font-weight: 700;">
            System Statistics
          </h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: clamp(15px, 3vw, 30px);">
            <div style="background: white; padding: clamp(20px, 4vw, 30px); border-radius: 15px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
              <div style="font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 15px;">👥</div>
              <div style="font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 700; color: #667eea; margin-bottom: 10px;">500+</div>
              <p style="color: #7f8c8d; margin: 0; font-size: clamp(0.9rem, 2.5vw, 1.1rem);">Active Users</p>
            </div>
            
            <div style="background: white; padding: clamp(20px, 4vw, 30px); border-radius: 15px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
              <div style="font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 15px;">📚</div>
              <div style="font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 700; color: #f093fb; margin-bottom: 10px;">50+</div>
              <p style="color: #7f8c8d; margin: 0; font-size: clamp(0.9rem, 2.5vw, 1.1rem);">Courses Available</p>
            </div>
            
            <div style="background: white; padding: clamp(20px, 4vw, 30px); border-radius: 15px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
              <div style="font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 15px;">📰</div>
              <div style="font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 700; color: #4facfe; margin-bottom: 10px;">1000+</div>
              <p style="color: #7f8c8d; margin: 0; font-size: clamp(0.9rem, 2.5vw, 1.1rem);">Articles Published</p>
            </div>
            
            <div style="background: white; padding: clamp(20px, 4vw, 30px); border-radius: 15px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
              <div style="font-size: clamp(2rem, 5vw, 3rem); margin-bottom: 15px;">🏆</div>
              <div style="font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 700; color: #27ae60; margin-bottom: 10px;">98%</div>
              <p style="color: #7f8c8d; margin: 0; font-size: clamp(0.9rem, 2.5vw, 1.1rem);">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Articles Section -->
      <div style="background: white; padding: clamp(40px, 8vw, 80px) 20px;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <h2 style="text-align: center; color: #2c3e50; font-size: clamp(1.5rem, 4vw, 2.5rem); margin: 0 0 clamp(30px, 6vw, 60px) 0; font-weight: 700;">
            📰 Educational Articles
          </h2>
          
          <div *ngIf="isLoadingArticles" style="text-align: center; padding: 50px;">
            <p style="color: #7f8c8d; font-size: 1.2rem;">🔄 Loading articles...</p>
          </div>
          
          <div *ngIf="!isLoadingArticles" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: clamp(20px, 4vw, 40px);">
            <div *ngFor="let article of articles" style="background: #f8f9fa; padding: clamp(20px, 4vw, 30px); border-radius: 15px; border-left: 4px solid #4facfe; box-shadow: 0 8px 25px rgba(0,0,0,0.1); transition: transform 0.3s ease;">
              <h3 style="color: #2c3e50; margin: 0 0 15px 0; font-size: clamp(1.2rem, 3vw, 1.5rem); font-weight: 600;">{{article.title}}</h3>
              <p style="color: #7f8c8d; margin: 0 0 15px 0; line-height: 1.6; font-size: clamp(0.9rem, 2.5vw, 1rem);">{{article.content | slice:0:150}}...</p>
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <span style="color: #4facfe; font-size: clamp(0.8rem, 2vw, 0.9rem); font-weight: 500;">📅 {{formatDate(article.createdAt)}}</span>
                <span style="color: #27ae60; font-size: clamp(0.8rem, 2vw, 0.9rem); font-weight: 500;">✏️ {{article.author}}</span>
              </div>
            </div>
          </div>
          
          <div *ngIf="articles.length === 0 && !isLoadingArticles" style="text-align: center; padding: 50px; background: #f8f9fa; border-radius: 15px; border: 2px dashed #e0e0e0;">
            <div style="font-size: 3rem; margin-bottom: 15px;">📰</div>
            <p style="color: #7f8c8d; font-size: 1.2rem; margin: 0;">No articles available at the moment.</p>
            <p style="color: #95a5a6; font-size: 1rem; margin: 10px 0 0 0;">Check back later for new educational content.</p>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background: #2c3e50; color: white; padding: clamp(25px, 5vw, 40px) 20px; text-align: center;">
        <p style="margin: 0 0 15px 0; font-size: clamp(1rem, 2.5vw, 1.2rem); font-weight: 600;">
          🎓 University Content Management System
        </p>
        <p style="margin: 0; opacity: 0.8; font-size: clamp(0.9rem, 2vw, 1rem);">
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
    
    /* Responsive Design */
    @media (max-width: 768px) {
      div:hover {
        transform: translateY(-5px);
      }
      button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
      }
    }
    
    @media (max-width: 480px) {
      div:hover {
        transform: translateY(-3px);
      }
      button:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(0,0,0,0.15);
      }
    }
    
    /* Touch device optimizations */
    @media (hover: none) and (pointer: coarse) {
      div:hover {
        transform: none;
      }
      button:hover {
        transform: none;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  imageError = false;
  articles: any[] = [];
  isLoadingArticles = false;

  constructor(private databaseService: DatabaseService) {}

  ngOnInit() {
    this.loadArticles();
  }

  loadArticles() {
    this.isLoadingArticles = true;
    this.databaseService.getArticles().subscribe({
      next: (response: any) => {
        this.articles = response.data || [];
        this.isLoadingArticles = false;
      },
      error: (error: any) => {
        console.error('Error loading articles:', error);
        this.isLoadingArticles = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

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

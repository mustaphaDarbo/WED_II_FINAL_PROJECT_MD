import { Component } from '@angular/core';
import { DatabaseService } from './database.service';

@Component({
  selector: 'app-article-management',
  template: `
    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); margin-bottom: 30px;">
      <h2 style="color: #2c3e50; margin-bottom: 30px;">📰 Article Management</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
        <!-- Create Article Form -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 12px;">
          <h3 style="color: #2c3e50; margin: 0 0 20px 0;">📝 Create New Article</h3>
          
          <div *ngIf="message" [style]="messageStyle" style="padding: 12px; border-radius: 6px; margin-bottom: 20px;">
            <p [innerHTML]="message"></p>
          </div>
          
          <form (ngSubmit)="createArticle()">
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📰 Title:</label>
              <input type="text" [(ngModel)]="newArticle.title" name="title" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" placeholder="Enter article title" required>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📝 Content:</label>
              <textarea [(ngModel)]="newArticle.content" name="content" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem; min-height: 150px;" placeholder="Enter article content" required></textarea>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📋 Description:</label>
              <textarea [(ngModel)]="newArticle.description" name="description" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem; min-height: 100px;" placeholder="Enter article description" required></textarea>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">🏷️ Category:</label>
              <select [(ngModel)]="newArticle.category" name="category" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" required>
                <option value="">Select Category</option>
                <option value="announcement">📢 Announcement</option>
                <option value="academic">🎓 Academic</option>
                <option value="news">📰 News</option>
                <option value="event">📅 Event</option>
                <option value="policy">📋 Policy</option>
              </select>
            </div>
            
            <button type="submit" [disabled]="isCreating" style="background: #9b59b6; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; width: 100%;">
              {{isCreating ? '🔄 Creating...' : '➕ Create Article'}}
            </button>
          </form>
        </div>
        
        <!-- Edit Article Form -->
        <div *ngIf="editingArticle" style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 30px; border: 2px solid #3498db;">
          <h3 style="color: #3498db; margin: 0 0 20px 0;">✏️ Edit Article</h3>
          
          <form (ngSubmit)="updateArticle()">
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📰 Title:</label>
              <input type="text" [(ngModel)]="editingArticle.title" name="editTitle" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" placeholder="Enter article title" required>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📝 Content:</label>
              <textarea [(ngModel)]="editingArticle.content" name="editContent" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem; min-height: 150px;" placeholder="Enter article content" required></textarea>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">📋 Description:</label>
              <textarea [(ngModel)]="editingArticle.description" name="editDescription" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem; min-height: 100px;" placeholder="Enter article description" required></textarea>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; color: #2c3e50; font-weight: 500;">🏷️ Category:</label>
              <select [(ngModel)]="editingArticle.category" name="editCategory" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 6px; font-size: 1rem;" required>
                <option value="">Select Category</option>
                <option value="announcement">📢 Announcement</option>
                <option value="academic">🎓 Academic</option>
                <option value="news">📰 News</option>
                <option value="event">📅 Event</option>
                <option value="policy">📋 Policy</option>
              </select>
            </div>
            
            <div style="display: flex; gap: 10px;">
              <button type="submit" [disabled]="isEditing === null" style="background: #3498db; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; flex: 1;">
                {{isEditing ? '🔄 Updating...' : '💾 Update Article'}}
              </button>
              <button type="button" (click)="cancelEdit()" style="background: #95a5a6; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; font-weight: 500; flex: 1;">
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
        
        <!-- Articles List -->
        <div style="background: #f8f9fa; padding: 25px; border-radius: 12px;">
          <h3 style="color: #2c3e50; margin: 0 0 20px 0;">📋 Existing Articles</h3>
          
          <div *ngIf="isLoading" style="text-align: center; padding: 20px;">
            <p style="color: #7f8c8d;">🔄 Loading articles...</p>
          </div>
          
          <div *ngIf="!isLoading" style="max-height: 400px; overflow-y: auto;">
            <div *ngFor="let article of articles; let i = index" style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid #9b59b6;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 5px 0; color: #2c3e50;">{{article.title}}</h4>
                  <p style="margin: 0 0 5px 0; color: #7f8c8d; font-size: 0.9rem;">👤 {{article.author?.email || 'Unknown'}}</p>
                  <p style="margin: 0 0 5px 0; color: #7f8c8d; font-size: 0.8rem;">🏷️ {{article.category}}</p>
                  <p style="margin: 0 0 10px 0; color: #2c3e50; font-size: 0.9rem; line-height: 1.4;">{{article.content | slice:0:100}}...</p>
                </div>
                <div style="display: flex; flex-direction: column; gap: 5px;">
                  <button (click)="editArticle(article)" style="background: #3498db; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                    ✏️ Edit
                  </button>
                  <button (click)="deleteArticle(article.id || '')" [disabled]="isDeleting === article.id" style="background: #e74c3c; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                    {{isDeleting === article.id ? '🔄' : '🗑️'}} Delete
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
export class ArticleManagementComponent {
  articles: any[] = [];
  newArticle = {
    title: '',
    description: '',
    content: '',
    category: ''
  };
  editingArticle: any = null;
  message = '';
  messageStyle = '';
  isLoading = false;
  isCreating = false;
  isDeleting: string | null = null;
  isEditing: string | null = null;
  
  constructor(private databaseService: DatabaseService) {
    this.loadArticles();
  }
  
  loadArticles() {
    this.isLoading = true;
    this.databaseService.getArticles().subscribe({
      next: (response: any) => {
        this.articles = response.articles || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading articles:', error);
        this.isLoading = false;
        this.showMessage('❌ Error loading articles. Please check your connection.', 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
      }
    });
  }
  
  createArticle() {
    if (!this.newArticle.title || !this.newArticle.description || !this.newArticle.content || !this.newArticle.category) {
      this.showMessage('❌ Please fill in all fields', 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
      return;
    }
    
    this.isCreating = true;
    
    this.databaseService.createArticle(this.newArticle).subscribe({
      next: (response) => {
        this.isCreating = false;
        if (response && response.success) {
          this.showMessage(`✅ Article "${this.newArticle.title}" created successfully!`, 'color: #155724; background: #d4edda; border: 1px solid #c3e6cb;');
          
          // Reset form
          this.newArticle = {
            title: '',
            description: '',
            content: '',
            category: ''
          };
          
          // Reload articles list
          this.loadArticles();
        } else {
          this.showMessage(`❌ Error creating article: ${response.message || 'Unknown error'}`, 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
        }
      },
      error: (error) => {
        this.isCreating = false;
        this.showMessage(`❌ Error creating article: ${error.message || 'Unknown error'}`, 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
      }
    });
  }
  
  editArticle(article: any) {
    this.editingArticle = { ...article };
    this.isEditing = article.id;
  }
  
  updateArticle() {
    if (!this.editingArticle) return;
    
    this.databaseService.updateArticle(this.editingArticle.id, this.editingArticle).subscribe({
      next: (response) => {
        if (response && response.success) {
          this.showMessage(`✅ Article "${this.editingArticle.title}" updated successfully!`, 'color: #155724; background: #d4edda; border: 1px solid #c3e6cb;');
          this.editingArticle = null;
          this.isEditing = null;
          this.loadArticles();
        } else {
          this.showMessage(`❌ Error updating article: ${response.message || 'Unknown error'}`, 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
        }
      },
      error: (error) => {
        this.showMessage(`❌ Error updating article: ${error.message || 'Unknown error'}`, 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
      }
    });
  }
  
  cancelEdit() {
    this.editingArticle = null;
    this.isEditing = null;
  }
  
  deleteArticle(articleId: string) {
    if (confirm('Are you sure you want to delete this article?')) {
      this.isDeleting = articleId;
      
      this.databaseService.deleteArticle(articleId).subscribe({
        next: () => {
          this.isDeleting = null;
          this.showMessage('✅ Article deleted successfully!', 'color: #155724; background: #d4edda; border: 1px solid #c3e6cb;');
          this.loadArticles();
        },
        error: (error) => {
          this.isDeleting = null;
          this.showMessage('❌ Failed to delete article', 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb;');
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

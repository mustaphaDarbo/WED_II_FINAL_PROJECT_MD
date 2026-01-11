import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ucums';
  isLoggedIn = false;
  currentUser: any = null;
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    this.checkLoginStatus();
    // Listen for storage changes (for multi-tab scenarios)
    window.addEventListener('storage', () => {
      this.checkLoginStatus();
    });
  }
  
  checkLoginStatus() {
    const userToken = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');
    const currentUser = localStorage.getItem('currentUser');
    
    this.isLoggedIn = !!(userToken && userRole && currentUser);
    
    if (this.isLoggedIn && currentUser) {
      try {
        this.currentUser = JSON.parse(currentUser);
      } catch (e) {
        this.currentUser = null;
      }
    } else {
      this.currentUser = null;
    }
  }
  
  logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    this.isLoggedIn = false;
    this.currentUser = null;
    this.router.navigate(['/login']);
  }
  
  getUserRole(): string {
    return localStorage.getItem('userRole') || '';
  }
}

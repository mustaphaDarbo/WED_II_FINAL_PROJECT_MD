import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');
    const currentUser = localStorage.getItem('currentUser');

    // Check if user is authenticated
    if (!token || !userRole || !currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class LecturerGuard {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');

    // Check if user is authenticated and is lecturer
    if (!token || !userRole || userRole !== 'lecturer') {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class StudentGuard {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');

    // Check if user is authenticated and is student
    if (!token || !userRole || userRole !== 'student') {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');

    // Check if user is authenticated and is admin
    if (!token || !userRole || userRole !== 'admin') {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}

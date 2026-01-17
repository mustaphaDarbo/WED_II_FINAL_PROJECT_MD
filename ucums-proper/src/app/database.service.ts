import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  _id?: string;
  id?: string;
  fullName: string;
  email: string;
  password?: string;
  role: 'admin' | 'student' | 'lecturer';
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private readonly API_URL = 'http://localhost:5000/api';
  
  constructor(private http: HttpClient) {}
  
  // Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('userToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }
  
  // User Management
  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/users`, { headers: this.getAuthHeaders() });
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/users`, user, { headers: this.getAuthHeaders() });
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/users/${id}`, { headers: this.getAuthHeaders() });
  }

  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/users?email=${email}`, { headers: this.getAuthHeaders() });
  }
  
  // Authentication
  authenticateUser(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/auth/login`, {
      email,
      password
    }, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
  
  // Course Management
  getCourses(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/courses`, { headers: this.getAuthHeaders() });
  }
  
  createCourse(course: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/courses`, course, { headers: this.getAuthHeaders() });
  }
  
  updateCourse(id: string, course: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/courses/${id}`, course, { headers: this.getAuthHeaders() });
  }
  
  deleteCourse(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/courses/${id}`, { headers: this.getAuthHeaders() });
  }
  
  // Article Management
  getArticles(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/articles`, { headers: this.getAuthHeaders() });
  }
  
  createArticle(article: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/articles`, article, { headers: this.getAuthHeaders() });
  }
  
  updateArticle(id: string, article: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/articles/${id}`, article, { headers: this.getAuthHeaders() });
  }
  
  deleteArticle(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/articles/${id}`, { headers: this.getAuthHeaders() });
  }
  
  // System Analytics
  getAnalytics(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/analytics`, { headers: this.getAuthHeaders() });
  }

  // Course Registration
  getEnrolledCourses(studentId: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/students/${studentId}/courses`, { headers: this.getAuthHeaders() });
  }

  enrollInCourse(courseId: string, studentId: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/registrations`, { courseId }, { headers: this.getAuthHeaders() });
  }

  unenrollFromCourse(courseId: string, studentId: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/registrations/${courseId}`, { headers: this.getAuthHeaders() });
  }

  // Student Grades
  getStudentGrades(studentId: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/students/${studentId}/grades`, { headers: this.getAuthHeaders() });
  }

  // Lecturer Courses
  getLecturerCourses(lecturerId: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/lecturers/${lecturerId}/courses`, { headers: this.getAuthHeaders() });
  }

  // User profile methods
  getCurrentUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/profile/profile`, { headers: this.getAuthHeaders() });
  }

  updateUser(userId: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/profile/profile`, userData, { headers: this.getAuthHeaders() });
  }

  uploadProfileImage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/profile/upload-profile-image`, formData, { 
      headers: this.getAuthHeaders().delete('Content-Type'), // Let browser set multipart/form-data
      reportProgress: true,
      observe: 'events'
    });
  }

  getCourse(courseId: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/courses/${courseId}`, { headers: this.getAuthHeaders() });
  }

  getCourseStudents(courseId: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/courses/${courseId}/students`, { headers: this.getAuthHeaders() });
  }

  // Lecturer specific methods
  getLecturerDashboard(lecturerId: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/lecturers/${lecturerId}/dashboard`, { headers: this.getAuthHeaders() });
  }
}

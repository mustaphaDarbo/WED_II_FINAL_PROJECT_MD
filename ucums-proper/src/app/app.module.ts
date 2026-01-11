import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { StudentDashboardComponent } from './student-dashboard.component';
import { LecturerDashboardComponent } from './lecturer-dashboard.component';
import { UserManagementComponent } from './user-management.component';
import { ArticleManagementComponent } from './article-management.component';
import { CourseManagementComponent } from './course-management.component';
import { TestCrudComponent } from './test-crud.component';
import { DebugAuthComponent } from './debug-auth.component';
import { AnalyticsComponent } from './analytics.component';
import { CourseRegistrationComponent } from './course-registration.component';
import { StudentProfileComponent } from './student-profile.component';
import { StudentGradesComponent } from './student-grades.component';
import { CourseStudentsComponent } from './course-students.component';
import { AssignmentManagementComponent } from './assignment-management.component';
import { GradeManagementComponent } from './grade-management.component';
import { LecturerAnalyticsComponent } from './lecturer-analytics.component';
import { StudentAssignmentsComponent } from './student-assignments.component';

// Services
import { DatabaseService } from './database.service';
import { AuthGuard, LecturerGuard, StudentGuard, AdminGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  { path: 'student-dashboard', component: StudentDashboardComponent, canActivate: [StudentGuard] },
  { path: 'lecturer-dashboard', component: LecturerDashboardComponent, canActivate: [LecturerGuard] },
  { path: 'lecturer-analytics', component: LecturerAnalyticsComponent, canActivate: [LecturerGuard] },
  { path: 'assignment-management/:courseId', component: AssignmentManagementComponent, canActivate: [LecturerGuard] },
  { path: 'grade-management/:courseId', component: GradeManagementComponent, canActivate: [LecturerGuard] },
  { path: 'test-crud', component: TestCrudComponent, canActivate: [AuthGuard] },
  { path: 'debug-auth', component: DebugAuthComponent, canActivate: [AuthGuard] },
  { path: 'analytics', component: AnalyticsComponent, canActivate: [AuthGuard] },
  { path: 'course-registration', component: CourseRegistrationComponent, canActivate: [StudentGuard] },
  { path: 'student-profile', component: StudentProfileComponent, canActivate: [StudentGuard] },
  { path: 'student-grades', component: StudentGradesComponent, canActivate: [StudentGuard] },
  { path: 'student-assignments', component: StudentAssignmentsComponent, canActivate: [StudentGuard] },
  { path: 'course-students/:courseId', component: CourseStudentsComponent, canActivate: [LecturerGuard] },
  { path: '**', redirectTo: '/home' }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AdminDashboardComponent,
    StudentDashboardComponent,
    LecturerDashboardComponent,
    UserManagementComponent,
    ArticleManagementComponent,
    CourseManagementComponent,
    TestCrudComponent,
    DebugAuthComponent,
    AnalyticsComponent,
    CourseRegistrationComponent,
    StudentProfileComponent,
    StudentGradesComponent,
    CourseStudentsComponent,
    AssignmentManagementComponent,
    GradeManagementComponent,
    LecturerAnalyticsComponent,
    StudentAssignmentsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [DatabaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }

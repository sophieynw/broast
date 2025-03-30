import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  message: string;
  id?: number;
  email?: string;
  name?: string;
  error?: string;
}

interface AuthStatus {
  isAuthenticated: boolean;
  user: User | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000'; // Flask backend URL
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
    // Check authentication status on service initialization
    this.checkAuthStatus();
  }

  // Toast message
  showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  // Register a new user
  signup(
    name: string,
    email: string,
    password: string
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/sign-up`, {
        name,
        email,
        password,
      })
      .pipe(
        tap((response) => {
          if (response.id && response.name && response.email) {
            const user: User = {
              id: response.id,
              name: response.name,
              email: response.email,
            };
            this.currentUserSubject.next(user);
            this.isAuthenticated$.next(true);
            this.showMessage(
              `Welcome ${response.name}! You've signed up successfully`
            );
          } else if (response.error) {
            this.showMessage(`Signup failed: ${response.error}`);
          }
        }),
        catchError((error) => {
          console.error('Signup error:', error);
          this.showMessage(
            `Signup failed: ${error.error?.error || 'Unknown error'}`
          );
          return of({
            message: 'Signup failed',
            error: error.error?.error || 'Unknown error',
          });
        })
      );
  }

  // Login user
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          if (response.id && response.name && response.email) {
            const user: User = {
              id: response.id,
              name: response.name,
              email: response.email,
            };
            this.currentUserSubject.next(user);
            this.isAuthenticated$.next(true);
            this.showMessage(`Welcome back, ${response.name}!`);
          } else if (response.error) {
            this.showMessage(`Login failed: ${response.error}`);
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          this.showMessage(
            `Login failed: ${error.error?.error || 'Invalid credentials'}`
          );
          return of({
            message: 'Login failed',
            error: error.error?.error || 'Unknown error',
          });
        })
      );
  }

  // Logout user
  logout(): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.currentUserSubject.next(null);
          this.isAuthenticated$.next(false);
          this.showMessage('You have been logged out successfully');
        }),
        catchError((error) => {
          console.error('Logout error:', error);
          // Even if server logout fails, clear client state
          this.currentUserSubject.next(null);
          this.isAuthenticated$.next(false);
          this.showMessage('Logout process completed');
          return of({ message: 'Logout failed on server but cleared locally' });
        })
      );
  }

  // Check if user is currently authenticated
  checkAuthStatus(): void {
    this.http
      .get<AuthStatus>(`${this.apiUrl}/api/is_authenticated`, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Auth check error:', error);
          return of({ isAuthenticated: false, user: null });
        })
      )
      .subscribe((status) => {
        this.isAuthenticated$.next(status.isAuthenticated);
        this.currentUserSubject.next(status.user);
      });
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.isAuthenticated$.value;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

    // Register a new user
    register(userData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/auth/signup`, userData).pipe(
        tap((response: any) => {
          console.log("Register Response:", response);
  
          if (response.first_name && response.role) {
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('role', response.role);
            localStorage.setItem('first_name', response.first_name);
          } else {
            console.error("Missing first_name or role in response", response);
          }
        })
      );
    }
 // Login an existing user
 login(credentials: { email: string; password: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
    tap((response: any) => {
      // Storing all necessary user details in localStorage
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      if (response.first_name) {
        localStorage.setItem('first_name', response.first_name); // Store first_name
      }

      if (response.role) {
        localStorage.setItem('role', response.role); // Store role
      }
    })
  );
}


  // Refresh access token
  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post(`${this.apiUrl}/auth/refresh-token`, { token: refreshToken });
  }

  // Logout user
  logout(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post(`${this.apiUrl}/auth/logout`, { token: refreshToken });
    
  }

  // Get access token from local storage
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Set access token in local storage
  setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  // Set refresh token in local storage
  setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
  }

  // Clear tokens from local storage
  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  // Get user ID from local storage
  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getUserFromToken(): any {
    const id = localStorage.getItem('userId');
    const username = localStorage.getItem('first_name');
    return {
      id: id,
      username: username
    };
  }
 
}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'https://dou6dqw5wa.execute-api.us-east-1.amazonaws.com/login';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'content-type': 'application/json'
    });
    //httpclient in angular returns an observable, which we can just
    //return true or false to the subscriber based on if the login was successful
    //the subscriber to this(login.component.ts) handles the true or false result
    return this.http.post<any>((this.loginUrl), { username: username,  password: password }).pipe(
      map(response => {
        if(response.message == "Login successful"){
          return true; //notify the subscriber that login was successful
        }else{
          return false; //notify subscriber login failed
        }
      }));
  }

  logout() {
    // Your logout logic with Lambda function
    // Simulating success for demonstration purposes
    const logoutSuccess = true;

    if (logoutSuccess) {
      // Redirect to login page or any other desired page
      localStorage.removeItem('authenticated');
      this.router.navigate(['/login']);
    } else {
      // Handle logout failure
      console.error('Logout failed');
    }
  }
}

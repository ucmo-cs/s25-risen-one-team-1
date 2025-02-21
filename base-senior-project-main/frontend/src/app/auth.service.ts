import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient,private router: Router) { }
  private loginUrl = 'https://dou6dqw5wa.execute-api.us-east-1.amazonaws.com/login';
  
  login(username: string, password: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'content-type': 'application/json'
    });
    // Your login logic with Lambda function here 
    var loginSuccess = false;
    this.http.post<any>((this.loginUrl), { username: "user", password: "pass"}).subscribe(
      response => {
        console.log(response);
        if(response.message == "Login successful"){
          loginSuccess = true;
          console.log("Client logged in");
        }
      }
    );
    
    return new Observable<boolean>((observer) => {
      if (loginSuccess) {
        observer.next(true); // Notify subscribers that login was successful
        observer.complete(); // Complete the observable
      } else {
        observer.error('Login failed'); // Notify subscribers that login failed
      }
    });
  }

  logout() {
    // Your logout logic with Lambda function
    // Simulating success for demonstration purposes
    const logoutSuccess = true;

    if (logoutSuccess) {
      // Redirect to login page or any other desired page
      this.router.navigate(['/login']);
    } else {
      // Handle logout failure
      console.error('Logout failed');
    }
  }
}
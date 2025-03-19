import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  // Define properties for the account information, Link to back end for adapative measures
  accountName: string = 'John Doe';
  accountEmail: string = 'john.doe@example.com';

  // Method to handle sign out
  signOut() {
    // Logic for signing out the user
    console.log('User signed out');
  }
}

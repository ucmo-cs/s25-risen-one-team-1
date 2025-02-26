import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {provideNativeDateAdapter} from '@angular/material/core';



interface previousRequest {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-form',
  providers: [provideNativeDateAdapter()],
  templateUrl: './edw.component.html',
  styleUrl: './edw.component.css'
})


export class EDWComponent {
  constructor (private router: Router ) {}
  /* Sign In navigation Function */
  ngOnInit(){}
  signIn() {
    this.router.navigate(['/login']);
  }
}

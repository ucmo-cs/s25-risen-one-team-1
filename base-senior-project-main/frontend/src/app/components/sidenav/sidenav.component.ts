import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {}
  admin: boolean = false;
  lead: boolean = false;
  tester: boolean = false;
  pm: boolean = false;
  isSidebarVisible: boolean = false;


}


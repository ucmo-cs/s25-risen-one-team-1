import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

// FullCalendar Imports (NEW)
import dayGridPlugin from '@fullcalendar/daygrid'; // Month view plugin
import interactionPlugin from '@fullcalendar/interaction'; // Enables clicking & dragging events

interface previousRequest {
value: string;
viewValue: string;
}

@Component({
selector: 'app-form',
providers: [provideNativeDateAdapter()],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  constructor(private router: Router) {}

  /* Sign In navigation Function */
  ngOnInit() {}

  signIn() {
    this.router.navigate(['/login']);
  }

  // FullCalendar Configuration (NEW)
  calendarOptions = {
    initialView: 'dayGridMonth', // Set default view to full-month
    plugins: [dayGridPlugin, interactionPlugin], // Enable month view & interactions
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    selectable: true, // Enables selecting dates
    editable: true, // Enables dragging/resizing events (for later)
    events: [] // Placeholder for events (can be loaded dynamically)
  };
}

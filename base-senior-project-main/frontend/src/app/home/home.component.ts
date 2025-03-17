import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { getAllDays, Day } from '../utility/days';

@Component({
  selector: 'app-form',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  events: any[] = [];

  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    selectable: true,
    editable: true,
    events: [] // Initialize as empty
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCalendarEvents();
  }

  async loadCalendarEvents(): Promise<void> {
    try {
      const apiEvents: Day[] = await getAllDays();
      console.log('Raw API Events:', apiEvents);

      this.events = apiEvents.map(event => ({
        title: `Employee ${event.EmployeeID}: ${event.HoursWorked} hrs`,
        start: this.convertDateFormat(event.date),
        allDay: true,
      }));

      console.log('Formatted Events for Calendar:', this.events);

      // Refresh the calendar with new events
      const calendarApi = this.calendarComponent.getApi();
      calendarApi.removeAllEvents();
      this.events.forEach(event => {
        calendarApi.addEvent(event);
      });

    } catch (error) {
      console.error('Error loading calendar events:', error);
    }
  }

  convertDateFormat(dateStr: string): string {
    if (!dateStr) return '';
    const [month, day, year] = dateStr.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  signIn() {
    this.router.navigate(['/login']);
  }
}

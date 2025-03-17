import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { getAllDays, Day } from '../utility/days';

@Component({
  selector: 'app-form',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    selectable: true,
    editable: true,
    events: []
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadCalendarEvents();
  }

  async loadCalendarEvents(): Promise<void> {
    try {
      const apiEvents: Day[] = await getAllDays();
      console.log('API Events:', apiEvents);

      const formattedEvents = apiEvents.map(event => ({
        title: `Employee ${event.EmployeeID}: ${event.HoursWorked} hrs`,
        date: this.convertDateFormat(event.date),
      }));

      this.calendarOptions.events = formattedEvents;
    } catch (error) {
      console.error('Error loading calendar events:', error);
    }
  }

  convertDateFormat(dateStr: string): string {
    const [month, day, year] = dateStr.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  signIn() {
    this.router.navigate(['/login']);
  }
}

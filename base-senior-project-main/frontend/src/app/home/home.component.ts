import { Component, OnInit } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { MockDatabaseService } from '../mock-database/mock-database.service';

// Import the defined interfaces
interface WorkSession {
date: string;
hours: number;
}

interface Employee {
name: string;
role: string;
workSessions: WorkSession[];
}

interface Project {
name: string;
employees: Employee[];
}

@Component({
selector: 'app-home',
templateUrl: './home.component.html',
styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
selectedProject: any = null;
projects: Project[] = [];
calendarEvents: any[] = [];

constructor(private mockDb: MockDatabaseService) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projects = this.mockDb.getProjects();
    this.updateCalendarEvents();
  }

  updateCalendarEvents() {
    this.calendarEvents = [];

    // Iterate through projects and employees to create events for each work session
    this.projects.forEach((proj: Project) => {
      proj.employees.forEach((emp: Employee) => {
        emp.workSessions.forEach((session: WorkSession) => {
          this.calendarEvents.push({
            title: `${proj.name} - ${emp.name}`,
            start: session.date,
            extendedProps: { role: emp.role, hours: session.hours }
          });
        });
      });
    });

    // Update calendar
    this.calendarOptions.events = this.calendarEvents;
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    selectable: true,
    editable: false,
    events: this.calendarEvents, // Dynamically updated from database
    eventClick: this.handleEventClick.bind(this)
  };

  handleEventClick(info: EventClickArg) {
    this.selectedProject = {
      name: info.event.title,
      role: info.event.extendedProps['role'],
      hours: info.event.extendedProps['hours']
    };
  }
}

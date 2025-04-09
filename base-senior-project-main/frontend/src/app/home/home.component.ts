import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

// API Imports
import { getAllDays, Day } from '../utility/days';
import { getAllEmployees, Employee } from '../utility/employee';
import { getAllProjects, Project } from '../utility/projects';

@Component({
  selector: 'app-form',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  employees: Employee[] = [];
  projects: Project[] = [];
  days: Day[] = [];

  calendarOptions: any = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    events: [],
    eventClick: this.handleEventClick.bind(this)
  };

  constructor(private router: Router, private dialog: MatDialog, private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
    await this.loadEventsToCalendar();
    await this.loadFederalHolidays();
  }

  async loadEventsToCalendar(): Promise<void> {
    try {
      // Load all API data in parallel
      const [days, employees, projects] = await Promise.all([
        getAllDays(),
        getAllEmployees(),
        getAllProjects()
      ]);

      this.employees = employees;
      this.projects = projects;
      this.days = days;

      const events = this.days.map(day => {
        const employee = this.employees.find(emp => emp.EmployeeID === day.EmployeeID);
        const project = this.projects.find(proj => proj.ProjectID === day.ProjectID);

        return {
          title: `${project?.ProjectName || 'Unknown Project'}`,
          start: this.convertDateFormat(day.date),
          extendedProps: {
            employeeName: employee?.EmployeeName || 'Unknown Employee',
            hoursWorked: day.HoursWorked,
            projectName: project?.ProjectName || 'Unknown Project'
          }
        };
      });

      this.calendarOptions.events = events;
    } catch (error) {
      console.error('Error loading calendar events:', error);
    }
  }

  async loadFederalHolidays(): Promise<void> {
    try {
      const holidays = await this.http
        .get('assets/holiday.txt', { responseType: 'text' })
        .toPromise();

      if (!holidays) {
        console.error('Holidays file is empty or could not be loaded.');
        return;
      }

      const holidayEvents = holidays
        .split('\n')
        .map(date => date.trim())
        .filter(date => date) // Remove empty lines
        .map(date => ({
          title: 'Holiday',
          start: date,
          display: 'background',
          color: '#d3d3d3' // Light red color for holidays
        }));

      this.calendarOptions.events = [
        ...this.calendarOptions.events,
        ...holidayEvents
      ];
    } catch (error) {
      console.error('Error loading holidays:', error);
    }
  }

  handleEventClick(info: any): void {
    const { employeeName, hoursWorked, projectName } = info.event.extendedProps;

    this.dialog.open(EventDetailsDialog, {
      data: {
        projectName,
        employeeName,
        hoursWorked
      }
    });
  }

  convertDateFormat(dateStr: string): string {
    const [month, day, year] = dateStr.split('-');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  signIn(): void {
    this.router.navigate(['/login']);
  }
}

@Component({
  selector: 'event-details-dialog',
  template: `
    <h2 mat-dialog-title>Project Details</h2>
    <mat-dialog-content>
      <p><strong>Project:</strong> {{ data.projectName }}</p>
      <p><strong>Employee:</strong> {{ data.employeeName }}</p>
      <p><strong>Hours Worked:</strong> {{ data.hoursWorked }} hrs</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `
})
export class EventDetailsDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

import { Component } from '@angular/core';
import { MockDatabaseService } from '../mock-database/mock-database.service';

// Define interfaces
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
selector: 'app-edw',
templateUrl: './edw.component.html',
styleUrls: ['./edw.component.css']
})
export class EdwComponent {
selectedView: string = 'month'; // Default view
selectedDate: string = new Date().toISOString().slice(0, 10); // Default to today
projects: Project[] = [];

constructor(private mockDb: MockDatabaseService) {}

  ngOnInit() {
    this.projects = this.mockDb.getProjects();
  }

  private parseDate(dateStr: string): Date {
    return new Date(dateStr);
  }

  private getDateRange(): { startDate: Date, endDate: Date } {
    let startDate = new Date(this.selectedDate);
    let endDate = new Date(this.selectedDate);

    if (this.selectedView === 'week') {
      const dayOfWeek = startDate.getDay();
      startDate.setDate(startDate.getDate() - dayOfWeek); // Start of week (Sunday)
      endDate.setDate(startDate.getDate() + 6); // End of week (Saturday)
    } else {
      startDate.setDate(1);
      endDate.setMonth(startDate.getMonth() + 1, 0);
    }

    return { startDate, endDate };
  }

  getAggregatedData() {
    const { startDate, endDate } = this.getDateRange();

    let aggregatedData: { name: string, role: string, totalHours: number }[] = [];

    this.projects.forEach((proj) => {
      proj.employees.forEach((emp) => {
        const totalHours = emp.workSessions
          .filter(session => {
            const sessionDate = this.parseDate(session.date);
            return sessionDate >= startDate && sessionDate <= endDate;
          })
          .reduce((sum, session) => sum + session.hours, 0);

        if (totalHours > 0) {
          const existingEntry = aggregatedData.find(entry => entry.name === emp.name);
          if (existingEntry) {
            existingEntry.totalHours += totalHours;
          } else {
            aggregatedData.push({ name: emp.name, role: emp.role, totalHours });
          }
        }
      });
    });

    return aggregatedData;
  }
}

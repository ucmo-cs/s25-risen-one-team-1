import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';

// FullCalendar Imports
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
selector: 'app-form',
providers: [provideNativeDateAdapter()],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  ngOnInit() {}

  signIn() {
    this.router.navigate(['/login']);
  }

  // U.S. Federal Holidays
  federalHolidays = [
    { date: '2025-01-01', name: "New Year's Day" },
    { date: '2025-01-20', name: "Martin Luther King Jr. Day" },
    { date: '2025-02-17', name: "Presidents' Day" },
    { date: '2025-05-26', name: "Memorial Day" },
    { date: '2025-07-04', name: "Independence Day" },
    { date: '2025-09-01', name: "Labor Day" },
    { date: '2025-10-13', name: "Columbus Day" },
    { date: '2025-11-11', name: "Veterans Day" },
    { date: '2025-11-27', name: "Thanksgiving Day" },
    { date: '2025-12-25', name: "Christmas Day" }
  ];

  // FullCalendar Configuration
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
    events: [],
    dayCellDidMount: (info) => {
      const dateStr = info.date.toISOString().split('T')[0];
      const day = info.date.getDay();

      if (day === 0 || day === 6) {
        // Weekends (Saturday & Sunday) - Dark Gray
        info.el.style.backgroundColor = '#a0a0a0';
      }
      this.federalHolidays.forEach(holiday => {
        if (holiday.date === dateStr) {
          // Federal Holidays - Light Gray
          info.el.style.backgroundColor = '#d3d3d3';
          const holidayLabel = document.createElement('div');
          holidayLabel.style.fontSize = '12px';
          holidayLabel.style.color = 'black';
          holidayLabel.style.textAlign = 'center';
          holidayLabel.style.padding = '2px';
          holidayLabel.style.borderRadius = '4px';
          holidayLabel.style.position = 'absolute';
          holidayLabel.style.bottom = '5px';
          holidayLabel.style.left = '50%';
          holidayLabel.style.transform = 'translateX(-50%)';
          holidayLabel.style.background = 'rgba(255, 255, 255, 0.8)';
          holidayLabel.innerText = holiday.name;
          info.el.appendChild(holidayLabel);
          info.el.style.position = 'relative';
        }
      });
    }
  };
}

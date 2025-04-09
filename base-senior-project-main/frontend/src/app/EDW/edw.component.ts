import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { getAllProjects, Project } from '../utility/projects';
import { getAllEmployees, Employee } from '../utility/employee';
import { getAllDays, Day } from '../utility/days';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-edw',
  templateUrl: './edw.component.html',
  styleUrls: ['./edw.component.css']
})
export class EdwComponent implements OnInit {
  months = ['January 2024', 'February 2024', 'March 2024', 'April 2024'];
  projects: Project[] = [];
  allDays: Day[] = [];
  groupedTimeSheets: {
    projectName: string;
    month: string;
    daysInMonth: number[];
    timeSheet: {
      employeeName: string;
      dailyHours: number[];
      total: number;
    }[];
  }[] = [];

  @ViewChild('innerContainer', { static: false }) innerContainer!: ElementRef;

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.projects = await getAllProjects();
    const allEmployees = await getAllEmployees();
    this.allDays = await getAllDays();

    // Debugging logs
    console.log("Projects: ", this.projects);
    console.log("Employees: ", allEmployees);
    console.log("All Days: ", this.allDays);

    for (const project of this.projects) {
      const employees = allEmployees.filter(e =>
        project.EmployeesID.map(String).includes(String(e.EmployeeID))
      );

      for (const month of this.months) {
        const [monthName, yearStr] = month.split(' ');
        const year = parseInt(yearStr, 10);
        const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
        const days = new Date(year, monthIndex + 1, 0).getDate();
        const daysInMonth = Array.from({ length: days }, (_, i) => i + 1);

        const timeSheet = [];

        for (const emp of employees) {
          const logs = this.allDays.filter(
            (d) =>
              d &&
              d.EmployeeID != null &&
              d.ProjectID != null &&
              d.date && // make sure date is defined
              String(d.EmployeeID) === String(emp.EmployeeID) &&
              d.ProjectID === project.ProjectID
          );

          // Debugging each employee's logs
          console.log(`Logs for employee ${emp.EmployeeName}:`, logs);

          const daily = daysInMonth.map((day) => {
            const targetDate = `${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}-${year}`;

            const match = logs.find((d) => {
              if (!d.date) return false;

              const logDate = d.date.replace(/[-\/]/g, '').padStart(8, '0');
              const target = targetDate.replace(/[-\/]/g, '').padStart(8, '0');

              return logDate === target;
            });

            return match && match.HoursWorked ? match.HoursWorked : 0;
          });

          const total = daily.reduce((a, b) => a + b, 0);

          timeSheet.push({ employeeName: emp.EmployeeName, dailyHours: daily, total });
        }

        this.groupedTimeSheets.push({
          projectName: project.ProjectName,
          month,
          daysInMonth,
          timeSheet
        });
      }
    }
  }

  generatePDF(): void {
    const containerElement = this.innerContainer.nativeElement;
    if (!containerElement) {
      console.error('Error: EDW inner container element not found.');
      return;
    }

    html2canvas(containerElement, {
      scale: 2,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      useCORS: true
    })
      .then((canvas) => {
        const image = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(image, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('EDW-Timesheet.pdf');
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  }
}

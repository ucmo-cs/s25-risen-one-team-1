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
      dailyHours: (number | null)[];
      total: number;
    }[];
  }[] = [];

  selectedProject: string = '';
  selectedMonth: string = '';
  signatureText: string = '';

  @ViewChild('innerContainer', { static: false }) innerContainer!: ElementRef;

  constructor() {}

  async ngOnInit(): Promise<void> {
    this.projects = await getAllProjects();
    const allEmployees = await getAllEmployees();
    this.allDays = await getAllDays();

    for (const project of this.projects) {
      const employees = allEmployees.filter(e =>
        project.EmployeesID.map(String).includes(String(e.EmployeeID))
      );

      for (const month of this.months) {
        const [monthName, yearStr] = month.split(' ');
        const year = parseInt(yearStr, 10);
        const date = new Date(`${monthName} 1, ${year}`);
        const monthIndex = date.getMonth();
        const days = new Date(year, monthIndex + 1, 0).getDate();
        const daysInMonth = Array.from({ length: days }, (_, i) => i + 1);

        // Log for debugging
        console.log(`Processing ${monthName} ${year}:`, {
          monthIndex,
          days,
          daysInMonth
        });

        const timeSheet = [];

        for (const emp of employees) {
          const logs = this.allDays.filter(
            (d) =>
              d &&
              d.EmployeeID != null &&
              d.ProjectID != null &&
              d.date &&
              String(d.EmployeeID) === String(emp.EmployeeID) &&
              d.ProjectID === project.ProjectID
          );

          console.log(`Logs for ${emp.EmployeeName} in ${project.ProjectName}:`, logs);

          const daily = daysInMonth.map((day) => {
            // Create date object with proper month index (0-11)
            const dateObj = new Date(year, monthIndex, day);
            const targetDate = dateObj.toISOString().split('T')[0]; // Get YYYY-MM-DD format
            const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6; // 0 = Sunday, 6 = Saturday

            // Log for debugging
            console.log(`Processing day ${day}:`, {
              targetDate,
              isWeekend,
              dayOfWeek: dateObj.getDay()
            });

            const match = logs.find((d) => {
              if (!d.date) return false;
              return d.date.slice(0, 10) === targetDate; // Compare date strings directly
            });

            console.log(`Checking date ${targetDate} (Weekend: ${isWeekend}):`, match ? match.HoursWorked : 'No match');

            if (!match) {
              console.warn(`No match found for date: ${targetDate}`);
              return isWeekend ? 0 : null; // Return 0 for weekends, null for other missing days
            }

            // Return the hours worked as a number
            return match.HoursWorked;
          });


          const total = daily.filter(h => h !== null).reduce((a, b) => (a ?? 0) + (b ?? 0), 0) as number;
          console.log(`Total hours for ${emp.EmployeeName}:`, daily, total);

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

  get filteredGroupedTimeSheets() {
    return this.groupedTimeSheets.filter(sheet => {
      const projectMatch = this.selectedProject ? sheet.projectName === this.selectedProject : true;
      const monthMatch = this.selectedMonth ? sheet.month === this.selectedMonth : true;
      return projectMatch && monthMatch;
    });
  }


  generatePDF(): void {
    const containerElement = this.innerContainer.nativeElement;

    if (!containerElement) {
      console.error('Error: EDW inner container element not found.');
      return;
    }

    html2canvas(containerElement, {
      scale: 2,
      scrollX: 0,
      scrollY: -window.scrollY,
      useCORS: true,
      windowWidth: containerElement.scrollWidth,
      windowHeight: containerElement.scrollHeight
    })
      .then((canvas) => {
        const imageData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth()*.7;
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // First page
        pdf.addImage(imageData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Add more pages if needed
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imageData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save('EDW-Timesheet.pdf');
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  }


}

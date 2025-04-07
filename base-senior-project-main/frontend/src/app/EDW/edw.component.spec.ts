import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EdwComponent } from './edw.component';
import { FormsModule } from '@angular/forms';
import * as projectApi from '../utility/projects';
import * as employeeApi from '../utility/employee';
import * as daysApi from '../utility/days';

describe('EdwComponent', () => {
  let component: EdwComponent;
  let fixture: ComponentFixture<EdwComponent>;

  beforeEach(async () => {
    // Mock the API responses with valid structure

    // Mocking getAllProjects (returns the "Mock Project" with EmployeeID 101)
    spyOn(projectApi, 'getAllProjects').and.returnValue(Promise.resolve([
      {
        ProjectID: 1,
        ProjectName: 'Mock Project',
        EmployeesID: [101, 202] // Including Anakin (ID 202)
      }
    ]));

    // Mocking getAllEmployees (returns John Doe and Anakin)
    spyOn(employeeApi, 'getAllEmployees').and.returnValue(Promise.resolve([
      {
        EmployeeID: 101,
        EmployeeName: 'John Doe',
        ProjectID: 1
      },
      {
        EmployeeID: 202,
        EmployeeName: 'Anakin Skywalker',
        ProjectID: 1
      }
    ]));

    // Mocking getAllDays (returns Anakin and John Doe's work logs)
    spyOn(daysApi, 'getAllDays').and.returnValue(Promise.resolve([
      {
        DayID: 1,
        EmployeeID: 101,
        date: '02-01-2024', // MM-DD-YYYY format
        HoursWorked: 4,
        ProjectID: 1
      },
      {
        DayID: 2,
        EmployeeID: 202,
        date: '02-09-2024', // Anakin's work date
        HoursWorked: 8,
        ProjectID: 1
      }
    ]));

    await TestBed.configureTestingModule({
      declarations: [EdwComponent],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EdwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build groupedTimeSheets correctly from API data', async () => {
    // Call ngOnInit to ensure the data is loaded
    await component.ngOnInit();

    // Ensure groupedTimeSheets is populated
    expect(component.groupedTimeSheets.length).toBeGreaterThan(0);

    // Check if the "Mock Project" data for February 2024 is included
    const group = component.groupedTimeSheets.find(g => g.projectName === 'Mock Project' && g.month === 'February 2024');
    expect(group).toBeTruthy();

    // Ensure there is at least one employee in the timesheet for that month
    expect(group?.timeSheet.length).toBeGreaterThan(0);

    // Check the employee data for "John Doe"
    const employeeRow = group?.timeSheet.find(row => row.employeeName === 'John Doe');
    expect(employeeRow?.employeeName).toBe('John Doe');
    expect(employeeRow?.total).toBe(4); // John worked 4 hours in February

    // Check the employee data for "Anakin Skywalker"
    const anakinRow = group?.timeSheet.find(row => row.employeeName === 'Anakin Skywalker');
    expect(anakinRow?.employeeName).toBe('Anakin Skywalker');
    expect(anakinRow?.total).toBe(8); // Anakin worked 8 hours on 02-09-2024
    expect(anakinRow?.dailyHours.includes(8)).toBeTrue(); // Verify Anakin's daily hours
  });
});

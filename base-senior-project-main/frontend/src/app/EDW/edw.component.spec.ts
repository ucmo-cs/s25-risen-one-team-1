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
    spyOn(projectApi, 'getAllProjects').and.returnValue(Promise.resolve([
      {
        ProjectID: 1,
        ProjectName: 'Mock Project',
        EmployeesID: [101]
      }
    ]));

    spyOn(employeeApi, 'getEmployeesByProjectId').and.returnValue(Promise.resolve([
      {
        EmployeeID: 101,
        EmployeeName: 'John Doe',
        ProjectID: 1
      }
    ]));

    spyOn(daysApi, 'getDaysByEmployeeAndProject').and.returnValue(Promise.resolve([
      {
        DayID: 1,
        EmployeeID: 101,
        date: '02-01-2024', // MM-DD-YYYY format
        HoursWorked: 4,
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
    await component.ngOnInit();

    expect(component.groupedTimeSheets.length).toBeGreaterThan(0);

    const group = component.groupedTimeSheets.find(g => g.projectName === 'Mock Project' && g.month === 'February 2024');
    expect(group).toBeTruthy();
    expect(group?.timeSheet.length).toBeGreaterThan(0);

    const employeeRow = group?.timeSheet[0];
    expect(employeeRow?.employeeName).toBe('John Doe');
    expect(employeeRow?.total).toBe(4);
    expect(employeeRow?.dailyHours.some((h: number) => h > 0)).toBeTrue();
  });
});

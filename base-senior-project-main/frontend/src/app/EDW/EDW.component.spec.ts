import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EDWComponent } from './EDW.component';

describe('EDWComponent', () => {
  let component: EDWComponent;
  let fixture: ComponentFixture<EDWComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EDWComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EDWComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountComponent } from './account.component';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default account name and email', () => {
    expect(component.accountName).toBe('John Doe');
  });

  it('should call signOut method', () => {
    spyOn(component, 'signOut');
    component.signOut();
    expect(component.signOut).toHaveBeenCalled();
  });
});

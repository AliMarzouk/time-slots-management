import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateTimeSelector } from './date-time-selector';

describe('DateTimeSelector', () => {
  let component: DateTimeSelector;
  let fixture: ComponentFixture<DateTimeSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateTimeSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateTimeSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

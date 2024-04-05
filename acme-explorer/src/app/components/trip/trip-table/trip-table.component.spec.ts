import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripTableComponent } from './trip-table.component';

describe('TripTableComponent', () => {
  let component: TripTableComponent;
  let fixture: ComponentFixture<TripTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

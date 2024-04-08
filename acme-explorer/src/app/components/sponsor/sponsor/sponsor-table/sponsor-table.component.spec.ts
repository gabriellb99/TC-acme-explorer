import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorTableComponent } from './sponsor-table.component';

describe('SponsorTableComponent', () => {
  let component: SponsorTableComponent;
  let fixture: ComponentFixture<SponsorTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponsorTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SponsorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripDisplayComponent } from './trip-display.component';
import { Trip } from 'src/app/models/trip.model';

describe('TripDisplayComponent', () => {
  let component: TripDisplayComponent;
  let fixture: ComponentFixture<TripDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize trip with proper values', () => {
    expect(component.trip).toBeDefined();
    expect(component.trip.ticker).toEqual('VI-123');
    expect(component.trip.title).toEqual('Punta Cana');
    expect(component.trip.description).toEqual('Gran viaje a un sitio paradisiaco');
    expect(component.trip.price).toEqual(123);
    expect(component.trip.requirements).toEqual(['Llevar crema solar', 'Pasarlo bien', 'Tomar mucho el sol']);
    expect(component.trip.startedAt).toEqual('15-03-2024');
    expect(component.trip.endAt).toEqual('25-03-2024');
    expect(component.trip.cancelReason).toEqual('');
    expect(component.trip.photos).toEqual([
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuwFKwx9FE8D82cONDRPwYuj-xNSjVmyJfDw&usqp=CAU',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF5fUUe6vXn77s-W1HET2YT3fRdOJib3xwDA&usqp=CAU',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFZhlSPtMtO3cMwY88jGt--dTKhVGdj9Pyrw&usqp=CAU'
    ]);
  });

  it('should return requirements properly', () => {
    const requirements = component.getRequirements();
    expect(requirements).toEqual(['Llevar crema solar', 'Pasarlo bien', 'Tomar mucho el sol']);
  });

  it('should format date properly', () => {
    const date = new Date('2024-03-15');
    const formattedDate = component.getFormattedDate(date);
    expect(formattedDate).toEqual('15-03-2024');
  });
});

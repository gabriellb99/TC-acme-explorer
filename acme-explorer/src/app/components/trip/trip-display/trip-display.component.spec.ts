import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TripDisplayComponent } from './trip-display.component';
import { Trip } from 'src/app/models/trip.model';
import { TripService } from 'src/app/services/trip.service';
import { ActivatedRouteStub } from '../../shared/activatedroute-stub';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';


describe('TripDisplayComponent', () => {
  let component: TripDisplayComponent;
  let fixture: ComponentFixture<TripDisplayComponent>;
  let mockActivateRoute: ActivatedRouteStub;
  let trip: Trip;
  let getTripSpy: any;

  beforeEach(async () => {
    mockActivateRoute = new ActivatedRouteStub();
    mockActivateRoute.testParams = {id: '1234567890'};

    trip = new Trip();
    trip.ticker = 'VI-123';
    trip.title = 'Punta Cana';
    trip.description = 'Gran viaje a un sitio paradisiaco';
    trip.price = 123;
    trip.requirements = ['Llevar crema solar', 'Pasarlo bien', 'Tomar mucho el sol'];
    trip.startedAt = new Date('2024-03-15');
    trip.endAt = new Date('2024-03-25');
    trip.cancelReason = '';
    trip.photos = ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuwFKwx9FE8D82cONDRPwYuj-xNSjVmyJfDw&usqp=CAU', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF5fUUe6vXn77s-W1HET2YT3fRdOJib3xwDA&usqp=CAU', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFZhlSPtMtO3cMwY88jGt--dTKhVGdj9Pyrw&usqp=CAU'];
  
    let tripSpy = jasmine.createSpyObj('TripService', ['getTripById']);
    getTripSpy = tripSpy.getTripById.and.returnValue(of(trip));

    await TestBed.configureTestingModule({
      declarations: [ TripDisplayComponent ],
      imports: [NgbCarouselModule],
      providers: [
        { provide: TripService, useValue: tripSpy },
        { provide: ActivatedRoute, useValue: mockActivateRoute }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize trip with proper values', async () => {
    expect(component.trip).toBeDefined();
    expect(component.trip.ticker).toEqual(trip.ticker);
    expect(component.trip.title).toEqual(trip.title);
    expect(component.trip.description).toEqual(trip.description);
    expect(component.trip.price).toEqual(trip.price);
    expect(component.trip.requirements).toEqual(trip.requirements);
    expect(component.trip.startedAt).toEqual(trip.startedAt);
    expect(component.trip.endAt).toEqual(trip.endAt);
    expect(component.trip.cancelReason).toEqual(trip.cancelReason);
    expect(component.trip.photos).toEqual(trip.photos);
  });

  it('should return requirements properly', () => {
    const requirements = component.getRequirements();
    expect(requirements).toEqual(['Llevar crema solar', 'Pasarlo bien', 'Tomar mucho el sol']);
  });

  it('should load trip correctly', () => {
    expect(component.trip).not.toBeUndefined();
  })

  it('should display correct name', () => {
    let nameDiv = fixture.nativeElement.querySelector('h5.card-title.text-center');
    fixture.detectChanges();
    expect(nameDiv.textContent).toContain(component.trip.title);
  })

});

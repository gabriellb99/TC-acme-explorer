import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripTableComponent } from './trip-table.component';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { ActivatedRouteStub } from '../../shared/activatedroute-stub';
import { of } from 'rxjs';
import { TripService } from 'src/app/services/trip.service';
import { ActivatedRoute } from '@angular/router';

describe('TripTableComponent', () => {
  let component: TripTableComponent;
  let fixture: ComponentFixture<TripTableComponent>;
  let trip1: Trip;
  let trip2: Trip;
  const trips: Trip[] = [];
  let authService: AuthService;
  let getTripSpy: any;
  let mockActivateRoute: ActivatedRouteStub;
  

  beforeEach(async () => {
    mockActivateRoute = new ActivatedRouteStub();

    trip1 = new Trip();
    trip1.ticker = 'VI-123';
    trip1.title = 'Punta Cana';
    trip1.description = 'Gran viaje a un sitio paradisiaco';
    trip1.price = 123;
    trip1.requirements = ['Llevar crema solar', 'Pasarlo bien', 'Tomar mucho el sol'];
    trip1.startedAt = new Date('2024-03-15');
    trip1.endAt = new Date('2024-03-25');
    trip1.cancelReason = '';
    trip1.photos = ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuwFKwx9FE8D82cONDRPwYuj-xNSjVmyJfDw&usqp=CAU', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF5fUUe6vXn77s-W1HET2YT3fRdOJib3xwDA&usqp=CAU', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFZhlSPtMtO3cMwY88jGt--dTKhVGdj9Pyrw&usqp=CAU'];
  
    trip2 = new Trip();
    trip2.ticker = '060424-RRMM';
    trip2.title = 'Riviera maya';
    trip2.description = 'Viaje al paraiso';
    trip2.price = 1230;
    trip2.requirements = ['Llevar abrigo'];
    trip2.startedAt = new Date('2024-06-15');
    trip2.endAt = new Date('2024-06-25');
    trip2.cancelReason = '';
    trip2.photos = [];
  
    trips.push(...[trip1, trip2]);

    let tripSpy = jasmine.createSpyObj('TripService', ['getAllAvailableTrips']);
    getTripSpy = tripSpy.getAllAvailableTrips.and.returnValue(of(trips));

       await TestBed.configureTestingModule({
      declarations: [ TripTableComponent ],
      providers: [AuthService,  { provide: TripService, useValue: tripSpy },
        { provide: ActivatedRoute, useValue: mockActivateRoute }],
            imports: [HttpClientModule,  provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
                provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
    })
    .compileComponents();
    authService = TestBed.inject(AuthService);

    fixture = TestBed.createComponent(TripTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 it('should render trip titles', () => {
    const titleColumns = fixture.nativeElement.querySelectorAll('ngx-datatable-column[name="title"]');
    expect(titleColumns.length).toEqual(trips.length);
    titleColumns.forEach((element: { textContent: any; }, index:number) => {
      expect(element.textContent).toContain(trips[index].title);
    });
  });

  it('should render trip descriptions', () => {
    const descriptionColumns = fixture.nativeElement.querySelectorAll('ngx-datatable-column[name="description"]');
    expect(descriptionColumns.length).toEqual(trips.length);
    descriptionColumns.forEach((element: { textContent: any; }, index:number) => {
      expect(element.textContent).toContain(trips[index].description);
    });
  });

  it('should render trip start dates', () => {
    const startDateColumns = fixture.nativeElement.querySelectorAll('ngx-datatable-column[name="startDate"]');
    expect(startDateColumns.length).toEqual(trips.length);
    startDateColumns.forEach((element: { textContent: any; }, index:number) => {
      expect(element.textContent).toContain(trips[index].startedAt);
    });
  });

  it('should render trip send dates', () => {
    const endDateColumns = fixture.nativeElement.querySelectorAll('ngx-datatable-column[name="endDate"]');
    expect(endDateColumns.length).toEqual(trips.length);
    endDateColumns.forEach((element: { textContent: any; }, index:number) => {
      expect(element.textContent).toContain(trips[index].endAt);
    });
  });

  it('should render trip prices', () => {
    const priceColumns = fixture.nativeElement.querySelectorAll('ngx-datatable-column[name="price"]');
    expect(priceColumns.length).toEqual(trips.length);
    priceColumns.forEach((element: { textContent: any; }, index:number) => {
      expect(element.textContent).toContain(trips[index].price);
    });
  });
 
  it('should render trip requirements', () => {
    const requirementElements = fixture.nativeElement.querySelectorAll('.trip-requirements');
    expect(requirementElements.length).toEqual(trips.length);
    trips.forEach((trip, index) => {
      const requirements = requirementElements[index].querySelectorAll('div');
      expect(requirements.length).toEqual(trip.requirements.length);
      trip.requirements.forEach((requirement, reqIndex) => {
        expect(requirements[reqIndex].textContent).toContain(requirement);
      });
    });
  });

});

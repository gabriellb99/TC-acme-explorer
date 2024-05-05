import { TestBed } from '@angular/core/testing';

import { TripService } from './trip.service';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { Timestamp, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from '../app-routing.module';
import { Trip } from '../models/trip.model';

describe('TripService', () => {
  let tripService: TripService;
  let failTrip : Trip;
  let correctTrip : Trip;
  let stages: any;

  beforeEach(async () => {
    failTrip = new Trip();

    failTrip.ticker = 'T123',
    failTrip.title= 'Test Trip',
    failTrip.description= 'This is a test trip',
    failTrip.startedAt= Timestamp.fromDate(new Date('2024-07-10')),
    failTrip.endAt= Timestamp.fromDate(new Date('2024-07-05')),
    failTrip.price= 100,
    failTrip.cancelReason= '',
    failTrip.requirements= [],
    failTrip.photos= [],
    failTrip.actor= 'user123'
    
    correctTrip = new Trip();
    correctTrip.ticker = 'VI-123';
    correctTrip.title = 'Punta Cana';
    correctTrip.description = 'Gran viaje a un sitio paradisiaco';
    correctTrip.price = 123;
    correctTrip.requirements = ['Llevar crema solar', 'Pasarlo bien', 'Tomar mucho el sol'];
    correctTrip.startedAt = Timestamp.fromDate(new Date('2024-08-15'));
    correctTrip.endAt = Timestamp.fromDate(new Date('2024-08-25'));
    correctTrip.cancelReason = '';
    correctTrip.photos = ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuwFKwx9FE8D82cONDRPwYuj-xNSjVmyJfDw&usqp=CAU', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF5fUUe6vXn77s-W1HET2YT3fRdOJib3xwDA&usqp=CAU', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFZhlSPtMtO3cMwY88jGt--dTKhVGdj9Pyrw&usqp=CAU'];

    stages = [
      { title: 'Stage 1', description: 'Description for Stage 1', price: 50 },
      { title: 'Stage 2', description: 'Description for Stage 2', price: 75 }
    ];

    TestBed.configureTestingModule({
      providers: [TripService],
      imports: [provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
          provideAuth(() => getAuth()), provideFirestore(() => getFirestore())],
  });
  tripService = TestBed.inject(TripService);
  });

  it('should be created', () => {
    expect(tripService).toBeTruthy();
  });
  
  it('should throw error when creating trip with startDate after endDate', async () => {
    const stages: string[] = ['Stage 1', 'Stage 2'];

    try {
      await tripService.createTrip(failTrip, stages, 'user123');
      fail('Expected error when creating trip with startDate after endDate');
    } catch (error: any) {
      expect(error.message).toContain('Start date must be before end date');
    }
  });

  it('should create a correct trip', async () => {
    let errorOccurred = false;
    try {
      await tripService.createTrip(correctTrip, stages, 'user123');
    } catch (error) {
      errorOccurred = true;
    }
    expect(errorOccurred).toBeFalse();
});
});

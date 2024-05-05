import { TestBed } from '@angular/core/testing';

import { ApplyService } from './apply.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { Timestamp, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { TripService } from './trip.service';
import { Application } from '../models/application.model';
import { Trip } from '../models/trip.model';

describe('ApplyService', () => {
  let applyService: ApplyService;
  let tripService: TripService;
  let failApplication: Application;
  let correctApplication: Application;
  let correctTrip : Trip;

  beforeEach(() => {
    correctTrip = new Trip();
    correctTrip.ticker = 'VI-123';
    correctTrip.title = 'Punta Cana';
    correctTrip.description = 'Gran viaje a un sitio paradisiaco';
    correctTrip.price = 123;
    correctTrip.requirements = ['Llevar crema solar', 'Pasarlo bien', 'Tomar mucho el sol'];
    correctTrip.startedAt = Timestamp.fromDate(new Date('2024-08-15'));
    correctTrip.endAt = Timestamp.fromDate(new Date('2024-08-25'));
    correctTrip.cancelReason = '';
    correctTrip.photos = [];

    
 
    TestBed.configureTestingModule({
      providers: [ApplyService, TripService],
      imports: [provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
          provideAuth(() => getAuth()), provideFirestore(() => getFirestore())],
  });
  applyService = TestBed.inject(ApplyService);
  tripService = TestBed.inject(TripService);
  });

  it('should be created', () => {
    expect(applyService).toBeTruthy();
  });

  it('should throw error when creating application with a trip with startDate before current date', async () => {
    const userId = '1234';
    const tripId = ''

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

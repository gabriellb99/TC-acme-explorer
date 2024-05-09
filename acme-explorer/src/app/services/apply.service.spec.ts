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
  let failTrip : Trip;
  let stages: any;

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


    failTrip = new Trip();

    failTrip.ticker = 'T123',
    failTrip.title= 'Test Trip',
    failTrip.description= 'This is a test trip',
    failTrip.startedAt= Timestamp.fromDate(new Date('2024-05-05')),
    failTrip.endAt= Timestamp.fromDate(new Date('2024-05-15')),
    failTrip.price= 100,
    failTrip.cancelReason= '',
    failTrip.requirements= [],
    failTrip.photos= []


    stages = [
      { title: 'Stage 1', description: 'Description for Stage 1', price: 50 },
      { title: 'Stage 2', description: 'Description for Stage 2', price: 75 }
    ];
    
 
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
      //search an old trip
      let tripFailId = await tripService.getATripWithStartDatePassed();
      if(tripFailId){
        await applyService.createApplication('user123',tripFailId,'');
        fail('Expected error when creating application with  a trip with startDate after endDate');
      }else{
        fail('Trip that has started not found');
      }
      
    } catch (error: any) {
      expect(error.message).toContain('Can not apply for a trip that passed');
    }
  });

  it('should create an application with a correct trip', async () => {
    let errorOccurred = false;
    try {
      let tripId = await tripService.createTrip(correctTrip, stages, 'user123');
      await applyService.createApplication('user123',tripId,'');
    } catch (error) {
      console.log(error);
      errorOccurred = true;
    }
    expect(errorOccurred).toBeFalse();
});
});

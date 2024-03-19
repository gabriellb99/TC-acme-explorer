import { Injectable } from '@angular/core';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor() { }

  createTrips(): Trip[] {
    let trip: Trip;
    let trips: Trip[];

    // trip 1
    trips = new Array();
    trip = new Trip();
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
    trips.push(trip);

    // trip 2
    trip = new Trip();
    trip = new Trip();
    trip.ticker = 'VI-100';
    trip.title = 'Paris';
    trip.description = 'Gran viaje a un sitio romántico';
    trip.price = 123;
    trip.requirements = ['Llevar calzado cómodo', 'Equipaje ligero', 'Disfrutar de la gastronomía'];
    trip.startedAt = new Date('2024-04-01');
    trip.endAt = new Date('2024-04-10');
    trip.cancelReason = '';
    trip.photos = ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuwFKwx9FE8D82cONDRPwYuj-xNSjVmyJfDw&usqp=CAU', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF5fUUe6vXn77s-W1HET2YT3fRdOJib3xwDA&usqp=CAU', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFZhlSPtMtO3cMwY88jGt--dTKhVGdj9Pyrw&usqp=CAU'];
    trips.push(trip);


    return trips;


  }
}

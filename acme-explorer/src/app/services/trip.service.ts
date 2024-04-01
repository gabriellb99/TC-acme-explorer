import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore'; // Importa Firestore
import { Trip } from '../models/trip.model';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private firestore: Firestore) {} // Inyecta Firestore

  async getAllAvailableTrips(): Promise<Trip[]> {
    const tripRef = collection(this.firestore, 'trips'); // Utiliza Firestore.collection()
    //const q = query(tripRef, where("cancelReason", "==", ""), where("startedAt", ">", Timestamp.now()));

    const querySnapshot = await getDocs(tripRef);
  
    const trips: Trip[] = [];
    querySnapshot.forEach((doc) => {
      let trip = this.getTrip(doc);
      trips.push(trip);
    });
  
    return trips;
  }

  public getTrip(doc: any): Trip {
    const data = doc.data();
    let trip = new Trip();
    trip.ticker = data['ticker'];
    trip.title = data['title'];
    trip.description = data['description'];
    trip.price = data['price'];
    trip.cancelReason = data['cancelReason'];
    trip.startedAt = data['startedAt'];
    trip.endAt = data['endAt'];
    trip.requirements = data['requirements'];
    trip.photos = data['photos'];
 
    return trip;
  }
}

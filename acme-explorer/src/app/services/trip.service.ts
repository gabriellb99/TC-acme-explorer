import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, doc, getDoc } from '@angular/fire/firestore'; // Importa Firestore
import { Trip } from '../models/trip.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private firestore: Firestore) {} 

  async getAllAvailableTrips(): Promise<Trip[]> {
    const tripRef = collection(this.firestore, 'trips'); 
    var now = new Date(new Date().toUTCString());
    const q = query(tripRef,where("cancelReason", "==", ""),where("startedAt", ">", now));
    //console.log(q);

    const querySnapshot = await getDocs(q);
    //console.log(querySnapshot);
  
    const trips: Trip[] = [];
    querySnapshot.forEach((doc) => {
      console.log(doc)
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
    trip.id = doc.id;
    console.log(trip);
    return trip;
  }

 getTripById(tripId: string): Observable<Trip | null> {  
    return new Observable<Trip | null>(observer => {
      try {
          const tripRef = collection(this.firestore, 'trips');
          const docRef = doc(tripRef, tripId);
          getDoc(docRef).then(doc => {
            if (doc.exists()) {
              const trip = this.getTrip(doc);
              observer.next(trip);
            } else {
                observer.next(null);
            }
            observer.complete();
          }).catch((err) => {
            observer.error(err);
          });
          
      } catch (error) {
          console.error('Error al obtener el viaje por ID:', error);
          observer.error(error);
      }
    });
  
  }


async searchTrips(searchValue: string): Promise<Trip[]> {

    const tripRef = collection(this.firestore, 'trips');

    console.log("searchTrips - searchValue:" + searchValue);

    const titleQuery = query(tripRef,
      where("title", ">=", searchValue),
      where("title", "<=", searchValue + "\uf8ff")
    );

    const descriptionQuery = query(tripRef,
      where("description", ">=", searchValue),
      where("description", "<=", searchValue + "\uf8ff")
    );

    const tickerQuery = query(tripRef,
      where("ticker", ">=", searchValue),
      where("ticker", "<=", searchValue + "\uf8ff")
    );

    const [titleSnapshot, descriptionSnapshot, tickerSnapshot] = await Promise.all([
      getDocs(titleQuery),
      getDocs(descriptionQuery),
      getDocs(tickerQuery)
    ]);

    const trips: Trip[] = [];

    titleSnapshot.forEach((doc) => {
      const trip = this.getTrip(doc);
      if (!trips.find(t => t.id === trip.id)) {
        trips.push(trip);
      }
    });

    descriptionSnapshot.forEach((doc) => {
      const trip = this.getTrip(doc);
      if (!trips.find(t => t.id === trip.id)) {
        trips.push(trip);
      }
    });

    tickerSnapshot.forEach((doc) => {
      const trip = this.getTrip(doc);
      if (!trips.find(t => t.id === trip.id)) {
        trips.push(trip);
      }
    });

    return trips;
}





}

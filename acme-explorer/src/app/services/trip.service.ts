import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, doc, getDoc } from '@angular/fire/firestore'; // Importa Firestore
import { Trip } from '../models/trip.model';
import { Observable, forkJoin } from 'rxjs';
import { observeInsideAngular } from '@angular/fire';

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

/*
  getAllTripsActor(actorId: string): Observable<Trip[] | null> {
    return new Observable<Trip[] | null>(observer => {
      try {
          const actorRef = collection(this.firestore, 'actors');
          const docRef = doc(actorRef, actorId);
          getDoc(docRef).then(doc => {
            if (doc.exists()) {
              const actorTrips: Trip[] = [];
              const actorTripIds = doc.data()['myTrips'] || [];
    
              if (actorTripIds.length > 0) {
                const tripObservables = actorTripIds.map((tripId: string) => this.getTripById(tripId));
                forkJoin(tripObservables).subscribe((trips: Trip) => {
                  actorTrips.push(...trips.filter((trip: any) => !!trip)); // Filtrar los trips nulos
                  observer.next(actorTrips);
                  observer.complete();
                }, (err: any) => {
                  observer.error(err);
                });
              } else {
                observer.next(null);
                observer.complete();
              }
            } else {
              observer.next(null);
              observer.complete();
            }
          }).catch(err => {
            observer.error(err);
          });
        } catch (error) {
          console.error('Error al obtener los viajes de un actor:', error);
          observer.error(error);
        }
      });
}
*/

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



}

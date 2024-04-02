import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, doc, getDoc, DocumentSnapshot } from '@angular/fire/firestore'; // Importa Firestore
import { Trip } from '../models/trip.model';

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
    trip.id = data['id']
 
    return trip;
  }

  async getTripById(tripId: string): Promise<Trip | null> {
    try {
        const tripRef = collection(this.firestore, 'trips');
        const q = query(tripRef, where('id', '==', tripId));
        const querySnapshot = await getDocs(q);
        let trip: Trip | null = null; // Inicializa la variable trip fuera del bucle
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            trip = this.getTrip(doc);
          });
        }
        return trip; // Devuelve el valor de trip fuera del bucle
    } catch (error) {
        console.error('Error al obtener el viaje por ID:', error);
        throw error;
    }
}



}

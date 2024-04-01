import { Injectable } from '@angular/core';
import { Trip } from '../models/trip.model';
import { Firestore, Timestamp, collection, query, where } from '@angular/fire/firestore'
import { getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private firestore: Firestore) { }

  async getAllAvailableTrips(){
    const tripRef = collection(this.firestore, 'trips');
    const q = query(tripRef, where("cancelReason", "==", ""), where("startedAt", ">", Timestamp.now()));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) =>{
      let trip = this.getTrip(doc)
      return(doc.data())
    }  

    );
  }

  //metodo que devuelve todos los trips que no esten ni cancelados y que aún no hayan empezado
  public getTrip(doc: any):Trip{
    const data = doc.data;
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

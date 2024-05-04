import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, writeBatch } from '@angular/fire/firestore';
import { Trip } from '../models/trip.model';
import { firstValueFrom, Observable, forkJoin } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';


const httpOptions ={
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private firestore: Firestore, private http: HttpClient, private activatedRout: ActivatedRoute) {} 

  async getAllAvailableTrips(userId: String | null = null): Promise<Trip[]> {
    const tripRef = collection(this.firestore, 'trips'); 
    var now = new Date(new Date().toUTCString());
    let q;
    if(userId){
      q = query(tripRef,where("startedAt", ">", now),where("actor","==",userId));
    }else{
      q = query(tripRef,where("cancelReason", "==", ""),where("startedAt", ">", now));
    }
    //console.log(q);

    const querySnapshot = await getDocs(q);
    //console.log(querySnapshot);
  
    const trips: Trip[] = [];
    querySnapshot.forEach((doc) => {
      let trip = this.getTrip(doc);
      trips.push(trip);
    });
    console.log(trips);
    return trips;
  }

  async getTripIdsByManagerId(userId: String | null = null): Promise<String[]> {
    const tripRef = collection(this.firestore, 'trips'); 
    var now = new Date(new Date().toUTCString());
    let q;
    q = query(tripRef,where("cancelReason", "==", ""),where("startedAt", ">", now),where("actor","==",userId));

    const querySnapshot = await getDocs(q);
  
    const tripsId: String[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      let tripId = data["id"];
      tripsId.push(tripId);
    });
    console.log(tripsId);
    return tripsId;
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

  getStagesByTripId(tripId: string): Observable<any[]> {
    return new Observable<any[]>(observer => {
      try {
        const tripRef = collection(this.firestore, 'trips');
        const docRef = doc(tripRef, tripId);
  
        // Acceder a la colección "stages" dentro del viaje
        const stagesRef = collection(docRef, 'stages');
  
        // Obtener todos los documentos de la colección "stages"
        getDocs(stagesRef).then(stagesSnapshot => {
          let stages: any[] = [];
          stagesSnapshot.forEach(stageDoc => {
            stages.push(stageDoc.data());
          });
  
          observer.next(stages);
          observer.complete();
        }).catch(err => {
          console.error('Error al obtener los stages:', err);
          observer.error(err);
        });
      } catch (error) {
        console.error('Error general:', error);
        observer.error(error);
      }
    });
  }

async searchTrips(searchValue: string,userId: string | null = null): Promise<Trip[]> {

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

    if(userId){
      const userQuery = query(tripRef,
        where("actor", "==", userId)
      );
    }
  

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

async createTrip(newTrip: Trip, stages: string[], idUser: string): Promise<void> {
  try {
    if(!newTrip.photos || newTrip.photos.length == 0) {
      newTrip.photos = [];
    }
    const tripRef = await addDoc(collection(this.firestore, 'trips'), {
      ticker: newTrip.ticker,
      title: newTrip.title,
      description: newTrip.description,
      startedAt: newTrip.startedAt,
      endAt: newTrip.endAt,
      price: newTrip.price,
      cancelReason: '',
      requirements: newTrip.requirements,
      photos: newTrip.photos,
      actor: idUser
    });
    console.log('Trip created successfully');

    // Añade una colección 'stages' dentro del documento de viaje recién creado
    const stagesCollectionRef = collection(tripRef, 'stages');
    // Añade las etapas a la colección 'stages'
    stages.forEach(async (stage: any) => {
      await addDoc(stagesCollectionRef, stage);
    });
    console.log('Stages added successfully');
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error;
  }
}


async updateTrip(tripId: string, updatedTrip: Trip, stages: string[]): Promise<void> {
  try {
    console.log('entra en modificar trip', tripId);
    const tripRef = doc(this.firestore, 'trips', tripId);
    console.log(updatedTrip.photos);
    if(!updatedTrip.photos || updatedTrip.photos.length == 0) {
      updatedTrip.photos = [];
      console.log('entra aqui');
    }
    await updateDoc(tripRef, {
      title: updatedTrip.title,
      description: updatedTrip.description,
      startedAt: updatedTrip.startedAt,
      endAt: updatedTrip.endAt,
      price: updatedTrip.price,
      requirements: updatedTrip.requirements,
      photos: updatedTrip.photos,
    });
    console.log('Trip updated successfully');

    // Referencia a la colección de etapas del viaje
    const stagesCollectionRef = collection(tripRef, 'stages');

    // Obtiene todas las etapas existentes
    const snapshot = await getDocs(stagesCollectionRef);
    // Elimina cada etapa existente
    const batch = writeBatch(this.firestore);
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit(); // Commit the batch
    console.log('Existing stages deleted successfully');

    // Añade las etapas a la colección 'stages'
    stages.forEach(async (stage: any) => {
      await addDoc(stagesCollectionRef, stage);
    });
  } catch (error) {
    console.error('Error updating trip:', error);
    throw error;
  }
}


async getTripTitle(tripID: string): Promise<string> {
  try {
    const docSnap = await getDoc(doc(this.firestore, `trips/${tripID}`));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data['title'];
    } else {
      throw new Error('No existe el documento');
    }
  } catch (error) {
    console.error('Error al obtener el título del viaje:', error);
    throw error;
  }
}

async cancelTrip(tripId: string, cancelReasonString: string) {
  try {
    console.log('entra en el servicio cancelar');
    await updateDoc(doc(this.firestore, 'trips', tripId), { cancelReason:cancelReasonString });
    console.log("trip actualizado exitosamente");
  } catch (error) {
    console.error("Error al actualizar trip:", error);
    throw error;
  }
}

async deleteTrip(tripId: string): Promise<void> {
  const tripRef = doc(this.firestore, 'trips', tripId);
  const stagesRef = collection(tripRef, 'stages');
  console.log('obtiene coleccion de stages');
  try {
    const stageDocs = await getDocs(stagesRef);
    console.log('antes del batch');
    const batch = writeBatch(this.firestore);
    console.log('despues del batch');
    stageDocs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    await deleteDoc(tripRef);

    console.log('Trip and its stages deleted successfully');
  } catch (error) {
    console.error('Error deleting trip and its stages:', error);
    throw error;
  }
}

}

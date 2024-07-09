import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, writeBatch, limit, Timestamp } from '@angular/fire/firestore';
import { Trip } from '../models/trip.model';
import { firstValueFrom, Observable, forkJoin } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from './message.service';


const httpOptions ={
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class TripService {
 

  constructor(private firestore: Firestore, private messageService : MessageService) {} 

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

  async getATripWithStartDatePassed(): Promise<string | null> {
    const tripRef = collection(this.firestore, 'trips'); 
    const now = new Date();
    const q = query(
        tripRef,
        where("cancelReason", "==", ""),
        where("startedAt", "<", now),
        limit(1)            
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    } else {
        const doc = querySnapshot.docs[0];
        const tripId = doc.id;
        console.log("First trip ID with start date passed:", tripId);
        return tripId;
    }
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

async createTrip(newTrip: Trip, stages: string[], idUser: string): Promise<string> {
  try {
   console.log(newTrip.requirements)
   let someEmptyRequirement = false;
   let requirements = newTrip.requirements;
   requirements.forEach(async (req: any) => {
    if(!req || req.length == 0) {
      someEmptyRequirement = true;
    }
  });
    if(newTrip.title.length == 0 || newTrip.description.length == 0 || newTrip.requirements == undefined 
      || newTrip.requirements.length == 0 || someEmptyRequirement|| newTrip.startedAt.toMillis() == 0 || newTrip.endAt.toMillis() == 0 
      || stages.length == 0 ){
      let errorMessage = $localize`Title, description, stages, all requirements, start date and end date must not be empty.`;
      this.messageService.notifyMessage(errorMessage, "alert alert-danger");
      throw new Error('Title, description, stages, all requirements, start date and end date must not be empty');
    }
    
    if (newTrip.startedAt.toMillis() <= new Date().getTime()) {
      let errorMessage = $localize`Start date must be after current date.`;
      this.messageService.notifyMessage(errorMessage, "alert alert-danger");
      throw new Error('Start date must be after current date');
    }
    if (newTrip.startedAt >= newTrip.endAt) {
      let errorMessage = $localize`The end date must be after the start date.`;
      this.messageService.notifyMessage(errorMessage, "alert alert-danger");
      throw new Error('Start date must be before end date');
    }
    let showPriceError = false;
    let showEmptyFieldsError = false;
    
    stages.forEach(async (stage: any) => {
      if(stage.price.length == 0 || stage.price < 0){
        showPriceError = true;
       
      }
      if(stage.title.length == 0 || stage.description.length == 0){
        showEmptyFieldsError = true;
        
      }
    });
    if(showEmptyFieldsError){
      let errorMessage = $localize`Title and description of stage must not be empty.`;
        this.messageService.notifyMessage(errorMessage, "alert alert-danger");
        throw new Error('Title and description of stage must not be empty');
    }
    if(showPriceError){
      let errorMessage = $localize`Price of stage must be not empty and greater than 0.`;
      this.messageService.notifyMessage(errorMessage, "alert alert-danger");
      throw new Error('price must be greater than 0');
    }
  

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

    return tripRef.id;
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error;
  }
}


async updateTrip(tripId: string, updatedTrip: Trip, stages: string[]): Promise<void> {
  try {
    let someEmptyRequirement = false;
   let requirements = updatedTrip.requirements;
   requirements.forEach(async (req: any) => {
    if(!req || req.length == 0) {
      someEmptyRequirement = true;
    }
  });
    if(updatedTrip.title.length == 0 || updatedTrip.description.length == 0 || updatedTrip.requirements == undefined 
      || updatedTrip.requirements.length == 0 || someEmptyRequirement|| updatedTrip.startedAt.toMillis() == 0 || updatedTrip.endAt.toMillis() == 0 
      || stages.length == 0 ){
      let errorMessage = $localize`Title, description, stages, all requirements, start date and end date must not be empty.`;
      this.messageService.notifyMessage(errorMessage, "alert alert-danger");
      throw new Error('Title, description, stages, all requirements, start date and end date must not be empty');
    }
    if (updatedTrip.startedAt.toMillis() <= new Date().getTime()) {
      let errorMessage = $localize`Start date must be after current date.`;
      this.messageService.notifyMessage(errorMessage, "alert alert-danger");
      throw new Error('Start date must be after current date');
    }
    if (updatedTrip.startedAt >= updatedTrip.endAt) {
      let errorMessage = $localize`Start date must be before end date.`;
      this.messageService.notifyMessage(errorMessage, "alert alert-danger");
      throw new Error('Start date must be before end date');
    }
    let showPriceError = false;
    let showEmptyFieldsError = false;
    stages.forEach(async (stage: any) => {
      
      if(stage.price == null || stage.price.length == 0 || stage.price < 0){
        showPriceError = true;
       
      }
      if(stage.title == null || stage.description == null || stage.title.length == 0 || stage.description.length == 0){
        
        showEmptyFieldsError = true;
        
      }
    });
    if(showEmptyFieldsError){
      let errorMessage = $localize`Title and description of stage must not be empty.`;
        this.messageService.notifyMessage(errorMessage, "alert alert-danger");
        throw new Error('Title and description of stage must not be empty');
    }
    if(showPriceError){
      let errorMessage = $localize`Price of stage must be not empty and greater than 0.`;
      this.messageService.notifyMessage(errorMessage, "alert alert-danger");
      throw new Error('price must be greater than 0');
    }

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

  async getTripStartDate(tripId: string): Promise<Date | PromiseLike<Date>> {
  try {
    const docSnap = await getDoc(doc(this.firestore, `trips/${tripId}`));
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data['startedAt'] instanceof Timestamp) {
        const timestamp = data['startedAt'] as Timestamp;
        return timestamp.toDate();
      } else {
        throw new Error('La fecha de inicio del viaje no está en el formato correcto');
      }
    } else {
      throw new Error('No existe el documento');
    }
  } catch (error) {
    console.error('Error al obtener la fecha del viaje:', error);
    throw error;
  }
}

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, Subject, firstValueFrom } from 'rxjs';
import { Application } from '../models/application.model';
import { Firestore, collection, query, where, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore'; // Importa Firestore

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json ' }),
};

@Injectable({
  providedIn: 'root'
})
export class ApplyService {
  

  public applys: any[] = [];
  public trips: any[] = [];
  public totalPrice = 0;
  private openPopupSubject = new Subject<string>();
  openPopup$ = this.openPopupSubject.asObservable();

  constructor(private firestore: Firestore) {} 

  async getAllApplications(): Promise<Application[]> {
    const applicationRef = collection(this.firestore, 'applications'); 
    //var now = new Date(new Date().toUTCString());
    //const q = query(applicationRef,where("applicationStatus", "==", "pending"));
    //console.log(q);

    const querySnapshot = await getDocs(applicationRef);
    //console.log(querySnapshot);
  
    const applications: Application[] = [];
    querySnapshot.forEach((doc) => {
      console.log(doc)
      let application = this.getApplication(doc);
      applications.push(application);
    });

    console.log(applications);
  
    return applications;
  }
  
  async getAllExplorerApplications(userId: string): Promise<Application[]> {
    console.log("explorerApplications", userId);
    const applicationRef = collection(this.firestore, 'applications'); 

    let q = query(applicationRef,where("actorID","==",userId));
    const querySnapshot = await getDocs(q);
  
    const applications: Application[] = [];
    querySnapshot.forEach((doc) => {
      let application = this.getApplication(doc);
      applications.push(application);
    });
    console.log(applications);
    return applications;
  }

  async getAllManagerApplications(userId: string): Promise<Application[]> {
    console.log("managerApplications");
    const tripsRef = collection(this.firestore, 'trips'); 
    const tripQuery = query(tripsRef, where('actor', '==', userId));

    // Obtenemos los IDs de los viajes del manager
    const tripDocs = await getDocs(tripQuery);
    const tripIds = tripDocs.docs.map(doc => doc.id);

    // Consulta las aplicaciones cuyo tripId está en la lista de IDs de viajes
    const applicationsRef = collection(this.firestore, 'applications');
    const applicationQuery = query(applicationsRef, where('trip', 'in', tripIds));

    // Obtenemos las aplicaciones
    const applicationDocs = await getDocs(applicationQuery);
    const applications: Application[] = applicationDocs.docs.map(doc => this.getApplication(doc));

    return applications;
  }

  
  public getApplication(doc: any): Application {
    const data = doc.data();
    let app = new Application();  
    app.reasons = data['reason'];    
    app.createdAt = data['createdAt'];
    app.comments = data['comments'];
    app.actorId = data['actorID'];
    app.trip = data['trip'];
    app.applicationStatus = data['applicationStatus'];
    app.id = doc.id;

    return app;
  }

  public async createApplication(userId: string, tripId: string, comment: string){
    const applicationData = {
      actorID: userId,
      applicationStatus: "pending",
      comments: comment,
      createdAt: new Date(),
      reason: "",
      trip: tripId
    };
    await addDoc(collection(this.firestore, "applications"),applicationData).then(async (docRef) => {
      console.log('Documento creado con ID:', docRef.id);
    })
    .catch((error) => {
      console.error('Error al crear documento:', error);
    });
  }

  async acceptApplication(applicationId: string) {
    //actualizamos application
    console.log(applicationId);
      try {
        await updateDoc(doc(this.firestore, 'applications', applicationId), {applicationStatus:"due"});
        console.log("application actualizado exitosamente");
      } catch (error) {
        console.error("Error al actualizar application:", error);
        throw error;
      }
    
  }

  async rejectApplication(applicationId: string, reasonText: string){
    //actualizamos application
    console.log(applicationId);
      try {
        await updateDoc(doc(this.firestore, 'applications', applicationId), {applicationStatus:"rejected", reason:reasonText});
        console.log("application actualizado exitosamente");
      } catch (error) {
        console.error("Error al actualizar application:", error);
        throw error;
      }
    
  }

  async deleteApplication(applicationId: string): Promise<void> {
    try {
      console.log("entra en servicio");
      await deleteDoc(doc(this.firestore, 'applications', applicationId));
      console.log('Application deleted successfully');
    } catch (error) {
      console.error('Error delesting application:', error);
      throw error;
    }
  }

  async afterPaidApplication(applicationId: string) {
    //actualizamos application
    console.log(applicationId);
      try {
        await updateDoc(doc(this.firestore, 'applications', applicationId), {applicationStatus:"accepted"});
        console.log("application actualizado exitosamente");
      } catch (error) {
        console.error("Error al actualizar application:", error);
        throw error;
      }
    
  }

}

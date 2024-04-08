import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, firstValueFrom } from 'rxjs';
import { Application } from '../models/application.model';
import { Firestore, collection, query, where, getDocs, doc, getDoc } from '@angular/fire/firestore'; // Importa Firestore

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

  constructor(private firestore: Firestore) {} 

  async getAllApplications(): Promise<Application[]> {
    const applicationRef = collection(this.firestore, 'applications'); 
    //var now = new Date(new Date().toUTCString());
    const q = query(applicationRef,where("applicationStatus", "==", "pending"));
    //console.log(q);

    const querySnapshot = await getDocs(q);
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
  
  public getApplication(doc: any): Application {
    const data = doc.data();
    let app = new Application();  

    app.ticker = data['ticker'];
    app.title = data['title'];    
    app.reasons = data['reason'];    
    app.createdAt = data['createdAt'];
    app.comments = data['comments'];
    
    app.id = doc.id;
    console.log("getApplication:", app);
    return app;
  }


  


}

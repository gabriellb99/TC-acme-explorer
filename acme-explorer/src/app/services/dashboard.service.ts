import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, CollectionReference, DocumentData } from '@angular/fire/firestore';
import { mean, min, max, standardDeviation } from 'simple-statistics';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private firestore: Firestore, private authservice: AuthService) { }


  generalInformation(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const tripsCollection = collection(this.firestore, 'trips');

      getDocs(tripsCollection).then(snapshot => {
        const trips = snapshot.docs.map(doc => doc.data());
        //console.log("generalInformation - trips: ", trips);

        const tripsPerManagerStats = this.getTripsPerManager(trips);
        //console.log("generalInformation - tripsPerManagerStats: ", tripsPerManagerStats);
      

        const tripPrices = trips.map(trip => trip['price']);
        //console.log("generalInformation - tripPrices: ", tripPrices);
       
        const tripPricesStats = this.calculateStats( "Stats - price of trips " , tripPrices);
      

        const applicationsRatio = this.getApplicationsRatio(trips);
        
        const applicationsPerTripStats = this.getApplicationsPerTrip();
        //console.log("generalInformation - applicationsPerTrip: ", applicationsPerTrip);

        
        const result = {
          tripsPerManager: tripsPerManagerStats,
          applicationsPerTrip: applicationsPerTripStats,
          tripPrices: tripPricesStats,
          applicationsRatio: applicationsRatio
        };


        resolve([result]);
      }).catch(error => {
        reject(error);
      });
    });
  }



  private getTripsPerManager(trips: any[]): any[] {
    const tripsPerManager: any[] = [];

    // Objeto para almacenar temporalmente las estadísticas de cada actor
    const managerStats: { [key: string]: number[] } = {};

    // Calcular la cantidad de viajes gestionados por cada actor
    trips.forEach(trip => {
      const manager = trip.actor;                 
      if (manager in managerStats) {
        managerStats[manager].push(trip.price);
      } else {
        managerStats[manager] = [trip.price];
      }
    });    

    // Calcular las estadísticas para cada actor
    for (const manager in managerStats) {
      const tripsCount = managerStats[manager];
      //console.log("tripsCount: " , tripsCount);
      const stats = {
        title: 'Trips per Manager',
        actor: manager,
        avg: mean(tripsCount),
        min: min(tripsCount),
        max: max(tripsCount),
        deviation: standardDeviation(tripsCount)
      };
      tripsPerManager.push(stats);
    }   

    return tripsPerManager;
  }
 
  private getApplicationsPerTrip(): any {   ///PENDIENTE DE HACER
    //const applicationsPerTrip = null;//trips.map(trip => trip.applications.length);
    //
    let applications = null;
    const applicationsCollection = collection(this.firestore, 'applications');
    getDocs(applicationsCollection).then(snapshot => {
      const applies = snapshot.docs.map(doc => doc.data());
      //console.log("getApplicationsPerTrip - applies: ", applies);

      applications = applies.map(application => application['trip']);

    });
    //console.log("getApplicationsPerTrip: ", applications)
    return applications;


  }

  private calculateStats(title: String, data: number[]): any {
    //console.log("calculateStats, title: ", title, " data: ", data);
    return {
      title: title,
      avg: mean(data),
      min: min(data),
      max: max(data),
      deviation: standardDeviation(data)
    };
  }

  private async getApplicationsRatio(trips: any[]): Promise<any[]> {
    const statusRatio: any[] = [];
    
    const applicationsCollection = collection(this.firestore, 'applications');
    const querySnapshot = await getDocs(applicationsCollection);    

    // Objeto para almacenar el recuento de aplicaciones por estado
    const statusCounts: { [key: string]: number } = {}; 

    querySnapshot.forEach(doc => {
        const data = doc.data();
       
        const status = data['applicationStatus'];
        if (status) {
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        }
        
        const stats= {
          status: status,
          count: statusCounts[status]
        }
        statusRatio.push(stats);
    });    

    console.log("getApplicationsRatio: statusRatio ", statusRatio);

    return statusRatio;
}

}

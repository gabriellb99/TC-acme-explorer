import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, CollectionReference, DocumentData } from '@angular/fire/firestore';
import { mean, min, max, standardDeviation } from 'simple-statistics';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private firestore: Firestore, private authservice: AuthService) { }
/*
  generalInformation(): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      const tripsCollection = collection(this.firestore, 'trips');

      getDocs(tripsCollection).then(snapshot => {
        const trips = snapshot.docs.map(doc => doc.data());
        const tripsPerManagerStats = this.getTripsPerManager(trips);
        const tripPrices = trips.map(trip => trip['price']);
        const tripPricesStats = this.calculateStats("Stats - price of trips ", tripPrices);

        this.getApplicationsRatio(trips).then((applicationsRatio: any[]) => {
          const applicationsPerTripStats = null;
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
      }).catch(error => {
        reject(error);
      });
    });
  }
*/

generalInformation(): Promise<any[]> {
  return new Promise<any[]>((resolve, reject) => {
    const tripsCollection = collection(this.firestore, 'trips');

    getDocs(tripsCollection).then(snapshot => {
      const trips = snapshot.docs.map(doc => doc.data());
      const tripsPerManagerStats = this.getTripsPerManager(trips);
      const tripPrices = trips.map(trip => trip['price']);
      const tripPricesStats = this.calculateStats("Stats - price of trips ", tripPrices);

      this.getApplicationsRatio(trips).then((applicationsRatio: any[]) => {
        this.getApplicationsPerTrip(trips).then((applicationsPerTripStats: any[]) => {
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
      }).catch(error => {
        reject(error);
      });
    }).catch(error => {
      reject(error);
    });
  });
}

  private getTripsPerManager(trips: any[]): any[] {
    const tripsPerManager: any[] = [];
    const managerStats: { [key: string]: number[] } = {};

    trips.forEach(trip => {
      const manager = trip.actor;
      if (manager in managerStats) {
        managerStats[manager].push(trip.price);
      } else {
        managerStats[manager] = [trip.price];
      }
    });

    for (const manager in managerStats) {
      const tripsCount = managerStats[manager];
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

  private calculateStats(title: string, data: number[]): any {
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
    const statusCounts: { [key: string]: number } = {};

    querySnapshot.forEach(doc => {
      const data = doc.data();
      const status = data['applicationStatus'];
      if (status) {
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      }
      const stats = {
        status: status,
        count: statusCounts[status]
      }
      statusRatio.push(stats);
    });

    return statusRatio;
  }

  private async getApplicationsPerTrip(trips: any[]): Promise<any> {
    const applicationsCollection = collection(this.firestore, 'applications');
    const querySnapshot = await getDocs(applicationsCollection);
    const applicationsByTrip: { [key: string]: number[] } = {};
  
    querySnapshot.forEach(doc => {
      const data = doc.data();
      const tripID = data['trip'];
      if (tripID) {
        if (tripID in applicationsByTrip) {
          applicationsByTrip[tripID].push(1); // Adding an application to the trip
        } else {
          applicationsByTrip[tripID] = [1];
        }
      }
    });
  
    const applicationsPerTrip: any[] = [];
  
    for (const tripID in applicationsByTrip) {
      const applicationsCount = applicationsByTrip[tripID];
      const stats = {
        tripID: tripID,
        avg: mean(applicationsCount),
        min: min(applicationsCount),
        max: max(applicationsCount),
        deviation: standardDeviation(applicationsCount)
      };
      applicationsPerTrip.push(stats);
    }
  
    return applicationsPerTrip;
  }
  
}



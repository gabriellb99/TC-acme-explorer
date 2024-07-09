import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs } from '@angular/fire/firestore';
import { mean, min, max, standardDeviation } from 'simple-statistics';
import { AuthService } from './auth.service';
import { TripService } from './trip.service';
import { Trip } from './../models/trip.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private firestore: Firestore, 
    private authService: AuthService, 
    private tripService: TripService
  ) { }

  async generalInformation(): Promise<any[]> {
    const tripsCollection = collection(this.firestore, 'trips');

    try {
      const snapshot = await getDocs(tripsCollection);
      const trips = snapshot.docs.map(doc => doc.data());
      const tripsPerManagerStats = await this.getTripsPerManager(trips);
      const tripPrices = trips.map(trip => trip['price']);
      const tripPricesStats = this.calculateStats("Stats - price of trips ", tripPrices);
      const applicationsRatio = await this.getApplicationsRatio(trips);
      const applicationsPerTripStats = await this.getApplicationsPerTrip(trips);
      
      return [{
        tripsPerManager: tripsPerManagerStats,
        applicationsPerTrip: applicationsPerTripStats,
        tripPrices: tripPricesStats,
        applicationsRatio: applicationsRatio
      }];
    } catch (error) {
      throw error;
    }
  }

  private async getTripsPerManager(trips: any[]): Promise<any[]> {
    const tripsPerManager: any[] = [];
    const managerStats: { [key: string]: number[] } = {};

    for (const trip of trips) {
      try {
        const dataManager = await this.authService.getActorById(trip.actor);
        const manager = dataManager?.name + " " + dataManager?.surname;
        if (manager in managerStats) {
          managerStats[manager].push(trip.price);
        } else {
          managerStats[manager] = [trip.price];
        }
      } catch (error) {
        console.error('Error al obtener el actor:', error);
      }
    }

    for (const manager in managerStats) {
      const tripsCount = managerStats[manager];
      const stats = {
        title: 'Trips per Manager',
        actor: manager,
        avg: mean(tripsCount).toFixed(2),
        min: min(tripsCount).toFixed(2),
        max: max(tripsCount).toFixed(2),
        deviation: standardDeviation(tripsCount).toFixed(2)
      };
      tripsPerManager.push(stats);
    }
   
    return tripsPerManager;
  }

  private calculateStats(title: string, data: number[]): any {
    return {
      title: title,
      avg: mean(data).toFixed(2),
      min: min(data).toFixed(2),
      max: max(data).toFixed(2),
      deviation: standardDeviation(data).toFixed(2)
    };
  }

  private async getApplicationsRatio(trips: any[]): Promise<any[]> {
    const statusCounts: { [key: string]: number } = {};
    const applicationsCollection = collection(this.firestore, 'applications');
    const querySnapshot = await getDocs(applicationsCollection);
  
    querySnapshot.forEach(doc => {
      const data = doc.data();
      const status = data['applicationStatus'];
      console.log("getApplicationsRatio - status: " + status);
      if (status) {
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      }
    });
  
    const statusRatio = Object.keys(statusCounts).map(status => ({
      status: status,
      count: statusCounts[status]
    }));
  
    return statusRatio;
  }
  

/*
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
      const tripTitle = await this.tripService.getTripTitle(tripID);
      const stats = {
        tripID: tripTitle,
        avg: mean(applicationsCount).toFixed(2),
        min: min(applicationsCount).toFixed(2),
        max: max(applicationsCount).toFixed(2),
        deviation: standardDeviation(applicationsCount).toFixed(2)
      };
      applicationsPerTrip.push(stats);
    }
  
    return applicationsPerTrip;
  }
*/
  
private async getApplicationsPerTrip(trips: any[]): Promise<any> {
  const applicationsCollection = collection(this.firestore, 'applications');
  const querySnapshot = await getDocs(applicationsCollection);
  const applicationsByTrip: { [key: string]: number[] } = {};
  const totalApplications = await this.getTotalApplications();//obtenemos el total de solicitudes

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
    const tripTitle = await this.tripService.getTripTitle(tripID);
    const stats = {
      tripID: tripTitle,
          //utilizamos la media = nº solicitudes de este viaje / total de solicitudes del sistema
      avg: (applicationsCount.length / totalApplications).toFixed(2),  //mean(applicationsCount).toFixed(2),
      min: min(applicationsCount).toFixed(2),
      max: max(applicationsCount).toFixed(2),
      deviation: standardDeviation(applicationsCount).toFixed(2)
    };
    applicationsPerTrip.push(stats);
  }

  return applicationsPerTrip;
}


  private async getTotalApplications(): Promise<number> {
    const applicationsCollection = collection(this.firestore, 'applications');
    const querySnapshot = await getDocs(applicationsCollection);
    let totalApplications = 0;
  
    querySnapshot.forEach(doc => {
      totalApplications++;
    });
  
    return totalApplications;
  }
  
  
}

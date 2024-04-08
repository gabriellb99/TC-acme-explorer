import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, firstValueFrom } from 'rxjs';
import { Sponsor } from '../models/sponsor';
import { Firestore, collection, query, where, getDocs, doc, getDoc } from '@angular/fire/firestore'; // Importa Firestore

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json ' }),
};

@Injectable({
  providedIn: 'root'
})
export class SponsorService {

  public sponsors: any[] = [];  

  constructor(private firestore: Firestore) {} 

  async getAllSponsors(): Promise<Sponsor[]> {
    const sponsorRef = collection(this.firestore, 'sponsorships');    
    const q = query(sponsorRef,where("flatRate", ">=",0));
    
    const querySnapshot = await getDocs(q);
    //console.log(querySnapshot);
  
    const sponsors: Sponsor[] = [];
    querySnapshot.forEach((doc) => {
      console.log(doc)
      let sponsor = this.getSponsor(doc);
      sponsors.push(sponsor);
    });

    console.log(sponsors);
  
    return sponsors;
  }  
  
  public getSponsor(doc: any): Sponsor {
    const data = doc.data();
    let sp = new Sponsor();  

    sp.url = data['url'];
    sp.linkAddInfo = data['linkAddInfo'];    
    sp.flatRate = data['flatRate'];    
    
    
    sp.id = doc.id;
    console.log("getSponsor:", sp);
    return sp;
  }
}

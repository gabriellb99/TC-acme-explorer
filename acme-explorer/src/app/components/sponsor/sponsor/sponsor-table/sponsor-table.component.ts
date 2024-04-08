import { Component, OnDestroy, OnInit } from '@angular/core';
import { Sponsor } from 'src/app/models/sponsor';
import { SponsorService } from 'src/app/services/sponsor.service';
import { Router } from '@angular/router';
import { Firestore, collection, query, where, getDocs, doc, getDoc } from '@angular/fire/firestore'; // Importa Firestore

@Component({
  selector: 'app-sponsor-table',
  templateUrl: './sponsor-table.component.html',
  styleUrls: ['./sponsor-table.component.css']
})
export class SponsorTableComponent implements OnInit {

  public id!: string;
  sponsors: any[] = []; 

  displayedColumns: string[] = ['url', 'linkAddInfo', 'flatRate']; // Nombres de las columnas a mostrar

  constructor(private sponsorService: SponsorService, private router: Router) {
    this.id = '0';
  }


  ngOnInit(): void {
    this.getAllSponsors();
  }


  getAllSponsors(): void {
    this.sponsorService.getAllSponsors()
      .then((sponsor: Sponsor[]) => {
        this.sponsors = sponsor; 
        console.log("service-getAllSponsors:" , this.sponsors.length);    
        
      })
      .catch((error) => {
        // Manejar errores aquí
        console.error('Error fetching trips:', error);
      });
  }


}

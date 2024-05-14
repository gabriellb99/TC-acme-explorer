import { Component, OnDestroy, OnInit } from '@angular/core';
import { Sponsor } from 'src/app/models/sponsor';
import { SponsorService } from 'src/app/services/sponsor.service';
import { Router } from '@angular/router';
import { Firestore, collection, query, where, getDocs, doc, getDoc } from '@angular/fire/firestore'; // Importa Firestore
import { TimeTrackerService } from 'src/app/services/time-tracker.service';
import { AuthService } from '../../../../services/auth.service';
import { Actor } from 'src/app/models/actor.model';

@Component({
  selector: 'app-sponsor-table',
  templateUrl: './sponsor-table.component.html',
  styleUrls: ['./sponsor-table.component.css']
})
export class SponsorTableComponent implements OnInit {

  public id!: string;
  sponsors: any[] = []; 
  firstTime = new Date().getTime();
  currentUrl: string = window.location.href; 
  protected currentActor: Actor | undefined;
  idUser!:string;

  displayedColumns: string[] = ['url', 'linkAddInfo', 'flatRate']; // Nombres de las columnas a mostrar

  constructor(private timeTracker: TimeTrackerService, private authService: AuthService, private sponsorService: SponsorService, private router: Router) {
    this.id = '0';
  }


  ngOnInit(): void {
    this.getAllSponsors();
    this.currentActor = this.authService.getCurrentActor();
  if(this.currentActor){
    this.idUser = this.currentActor.id;
  }
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

  ngOnDestroy(): void {
    //Antes de salir creamos o actualizamos el tiempo para que se quede guardado el total 
    let lastTime = new Date().getTime();
    let totalTime = lastTime - this.firstTime;
    this.timeTracker.createorUpdateUrlTime(this.currentUrl, this.idUser, totalTime);
  }


}

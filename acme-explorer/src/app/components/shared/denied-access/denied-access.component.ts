import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimeTrackerService } from 'src/app/services/time-tracker.service';
import { AuthService } from '../../../services/auth.service';
import { Actor } from 'src/app/models/actor.model';

@Component({
  selector: 'app-denied-access',
  templateUrl: './denied-access.component.html',
  styleUrls: ['./denied-access.component.css']
})
export class DeniedAccessComponent implements OnInit {

  protected url!: String;
  firstTime = new Date().getTime();
  currentUrl: string = window.location.href; 
  protected currentActor: Actor | undefined;
  idUser!:string;

  constructor(private timeTracker: TimeTrackerService, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentActor = this.authService.getCurrentActor();
  if(this.currentActor){
    this.idUser = this.currentActor.id;
  }
    this.url = location.origin + this.route.snapshot.queryParams['previousURL']
  }

  ngOnDestroy(): void {
    //Antes de salir creamos o actualizamos el tiempo para que se quede guardado el total 
    let lastTime = new Date().getTime();
    let totalTime = lastTime - this.firstTime;
    this.timeTracker.createorUpdateUrlTime(this.currentUrl, this.idUser, totalTime);
  }

}

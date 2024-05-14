import { Component, OnInit } from '@angular/core';
import { TimeTrackerService } from 'src/app/services/time-tracker.service';
import { AuthService } from '../../../services/auth.service';
import { Actor } from 'src/app/models/actor.model';

interface totalData {
  url: any;
  UserId: any;
  timeTracker: any;
}

@Component({
  selector: 'app-time-tracker',
  templateUrl: './time-tracker.component.html',
  styleUrls: ['./time-tracker.component.css']
})
export class TimeTrackerComponent implements OnInit {
  firstTime = new Date().getTime();
  currentUrl: string = window.location.href; 
  protected currentActor: Actor | undefined;
  idUser!:string;
  protected listaTotalDatos: totalData[] = [];
  protected datoMinimo !: number;
  protected datoMaximo !: number;
  protected urlMinimo !: string;
  protected urlMaximo !: string;
  protected datoMedia : number = 0;
  protected datoTotal : number = 0;




  constructor(private timeTracker: TimeTrackerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.currentActor = this.authService.getCurrentActor();
    if(this.currentActor){
      this.idUser = this.currentActor.id;
    }
    this.timeTracker.getTimeUrlByActor(this.idUser).then(data => {
      this.listaTotalDatos = data;
      this.urlMinimo = this.listaTotalDatos[0].url;
      this.datoMinimo = this.listaTotalDatos[0].timeTracker;
      this.urlMaximo = this.listaTotalDatos[0].url;
      this.datoMaximo = this.listaTotalDatos[0].timeTracker;
      this.listaTotalDatos.forEach(item => {
        if (item.timeTracker != null) {
          if(item.timeTracker < this.datoMinimo){
            this.urlMinimo = item.url;
            this.datoMinimo = item.timeTracker;
          }
  
          if(item.timeTracker > this.datoMaximo){
            this.urlMaximo = item.url;
            this.datoMaximo = item.timeTracker;
          }
          this.datoMedia += 1;
          this.datoTotal += item.timeTracker;
        }
      });
      this.datoMedia = this.datoTotal / this.datoMedia;
    });
    
  }

  formatTime(milliseconds: number): string {
    // Calcula las horas, minutos y segundos
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    // Formatea el tiempo a HH:mm:ss
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

}

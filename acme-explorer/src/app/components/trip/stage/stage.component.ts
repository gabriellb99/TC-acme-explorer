import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Trip } from 'src/app/models/trip.model';
import { TripService } from 'src/app/services/trip.service';
import { TimeTrackerService } from 'src/app/services/time-tracker.service';
import { AuthService } from '../../../services/auth.service';
import { Actor } from 'src/app/models/actor.model';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit {
  public id!: string;
  stages: any[] = []; // Asegúrate de inicializar con tus datos
  firstTime = new Date().getTime();
  currentUrl: string = window.location.href; 
  protected currentActor: Actor | undefined;
  idUser!:string;

  displayedColumns: string[] = ['title', 'description', 'price']; // Nombres de las columnas a mostrar

  constructor(private timeTracker: TimeTrackerService, private authService: AuthService, private tripService: TripService, private router: Router, private route: ActivatedRoute) {
    this.id = '0';
  }

  ngOnInit(): void {
    this.currentActor = this.authService.getCurrentActor();
    if(this.currentActor){
      this.idUser = this.currentActor.id;
    }

    this.id = this.route.snapshot.params['id'];

    this.tripService.getStagesByTripId(this.id).subscribe(stagesTrip => {
      if(stagesTrip){
        console.log(stagesTrip);
        this.stages = stagesTrip;
      }else{
        console.error('No se encontró ningún stages del viaje con el ID proporcionado.');
      }
      
     }, error => {
      console.error('Error al obtener los stages', error);
     });
  }

  goBack() {
    this.router.navigate(['/trips/' + this.id]);
  }

  ngOnDestroy(): void {
    //Antes de salir creamos o actualizamos el tiempo para que se quede guardado el total 
    let lastTime = new Date().getTime();
    let totalTime = lastTime - this.firstTime;
    this.timeTracker.createorUpdateUrlTime(this.currentUrl, this.idUser, totalTime);
  }

}

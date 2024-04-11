import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Trip } from 'src/app/models/trip.model';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-stage',
  templateUrl: './stage.component.html',
  styleUrls: ['./stage.component.css']
})
export class StageComponent implements OnInit {
  public id!: string;
  stages: any[] = []; // Asegúrate de inicializar con tus datos

  displayedColumns: string[] = ['title', 'description', 'price']; // Nombres de las columnas a mostrar

  constructor(private tripService: TripService, private router: Router, private route: ActivatedRoute) {
    this.id = '0';
  }

  ngOnInit(): void {
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

}

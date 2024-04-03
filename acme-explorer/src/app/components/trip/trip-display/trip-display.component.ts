import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Trip } from 'src/app/models/trip.model';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-trip-display',
  templateUrl: './trip-display.component.html',
  styleUrls: ['./trip-display.component.css']
})
export class TripDisplayComponent implements OnInit {

  public trip!: Trip;
  public id!: string;

  constructor(private tripService: TripService, private router: Router, private route: ActivatedRoute) {
    this.id = '0';
    this.trip = new Trip();
  }

  ngOnInit(): void {
   this.id = this.route.snapshot.params['id'];
   this.tripService.getTripById(this.id).subscribe(trip => {
    if(trip){
      this.trip = trip;
      console.log('Displaying trip:' + trip);
    }else{
      console.error('No se encontró ningún viaje con el ID proporcionado.');
    }
    
   }, error => {
    console.error('Error al obtener el trip', error);
   });
  }


 getRequirements() {
    return this.trip.requirements;
  }


  goBack() {
    this.router.navigate(['/']);
  }

}
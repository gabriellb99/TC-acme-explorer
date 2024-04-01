import { Component, OnInit } from '@angular/core';
import { Trip } from 'src/app/models/trip.model';
import { TripService } from 'src/app/services/trip.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../../../services/auth.service';
import { Actor } from 'src/app/models/actor.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent implements OnInit {

  protected trips!: Trip[];
  protected trash = faTrash;
  protected currentActor: Actor | undefined;

  constructor(private authService: AuthService, private tripService: TripService, private router: Router) { }
  

  removeTrip(index: number){
    this.trips[index].cancelReason = "cancelled";
  }

  ngOnInit(): void {
    this.tripService.getAllAvailableTrips()
    .then((trips: Trip[]) => {
      this.trips = trips;
      // Manejar los datos de los viajes aquí
      console.log('Trips:', trips);
    })
    .catch((error) => {
      // Manejar errores aquí
      console.error('Error fetching trips:', error);
    });

    

    this.currentActor = this.authService.getCurrentActor()
  }

  checkRole(roles: string): boolean {
    return this.authService.checkRole(roles);
  }

  displayTrip(id:String){
    console.log("Displaying: " + id);
    this.router.navigate(['/trips/'+id])
  }

  newTrip(){
    this.router.navigate(['/trips/new'])
  }

}
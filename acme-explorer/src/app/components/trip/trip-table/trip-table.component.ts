import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionType } from '@swimlane/ngx-datatable';
import { Actor } from 'src/app/models/actor.model';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-trip-table',
  templateUrl: './trip-table.component.html',
  styleUrls: ['./trip-table.component.css']
})
export class TripTableComponent implements OnInit {

  protected trips!: Trip[];
  protected currentActor: Actor | undefined;
  protected sorts = [
    {
      prop: 'startedAt',
      dir:'asc'
    },
    {
      prop:'price',
      dir:'desc'
    }
  ];
  protected selectionType = SelectionType.single;

  constructor(private authService: AuthService, private tripService: TripService, private router: Router) { }

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

  navigateToCardView(){
    this.router.navigate(['/trips'])
  }


}

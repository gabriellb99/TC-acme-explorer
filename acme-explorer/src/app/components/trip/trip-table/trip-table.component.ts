import { Component, OnInit, ViewChild } from '@angular/core';
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

  trips!: Trip[];
  currentActor: Actor | undefined;
  sorts = [
    {
      prop: 'startedAt',
      dir:'asc'
    },
    {
      prop:'price',
      dir:'desc'
    }
  ];
  selectionType = SelectionType.single;
  @ViewChild('myTable') table: any;


  constructor(private authService: AuthService, private tripService: TripService, private router: Router) { }

  ngOnInit(): void {
    this.currentActor = this.authService.getCurrentActor()
    //Si es un manager se muestran todos sus viajes 
    if(this.currentActor != null && this.currentActor.role === "Manager"){
      //hay un metodo en el trip.service pero no me sale
    }else{
        //si es un explorer se muestran todos los viajes disponibles
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
    }
  
  }

  checkRole(roles: string): boolean {
    return this.authService.checkRole(roles);
  }

  navigateToCardView(){
    this.router.navigate(['/trips'])
  }

  toggleExpandRow(row: any) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event: any) {
    console.log('Detail Toggled', event);
  }


}

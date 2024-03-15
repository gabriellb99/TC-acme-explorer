import { Component, OnInit } from '@angular/core';
import { Trip } from 'src/app/models/trip.model';
import { TripService } from 'src/app/services/trip.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent implements OnInit {

  protected trips: Trip[];
  protected trash = faTrash;

  constructor(private tripService: TripService) { 
    this.trips = tripService.createTrips();
  }

  removeTrip(index: number){
    this.trips[index].cancelReason = "cancelled";
  }

  ngOnInit(): void {
  }

}

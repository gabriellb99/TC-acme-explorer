import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trip-display',
  templateUrl: './trip-display.component.html',
  styleUrls: ['./trip-display.component.css']
})
export class TripDisplayComponent implements OnInit {

  protected trip: Trip;

  constructor() { 
    this.trip = new Trip();
    this.trip.ticker = ;
    this.trip.title = 'Punta Cana';
    this.trip.description = 'Gran viaja a un sitio paradisiaco';
    this.trip.price = ;
    this.trip.requirements = ['Llevar crema solar', 'Pasarlo bien', 'Tomar mucho el sol'];
    this.trip.startDate;
    this.trip.endDate;
    this.trip.cancelReason;
    this.trip.pictures = 
  }

  getRequirements() {
    return this.trip.requirements;
  }

  ngOnInit(): void {
  }

}

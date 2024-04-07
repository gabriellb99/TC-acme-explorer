import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
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
  countdownInterval: any;
  tripDateCountdown!: any;

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
      this.startCountdown();
    }else{
      console.error('No se encontró ningún viaje con el ID proporcionado.');
    }
    
   }, error => {
    console.error('Error al obtener el trip', error);
   });
  }

  startCountdown(): void {
    const targetDate = new Date(this.trip.startedAt).getTime();
    console.log(targetDate)

    this.countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      let msg= $localize `left`
      this.tripDateCountdown = `${days}d ${hours}h ${minutes}m` + msg;

      if (distance < 0) {
        clearInterval(this.countdownInterval);
        this.tripDateCountdown = $localize `Trip has started`;
      }
    }, 1000);

  }


  transformDate(timestamp: Date): string {
    let date = new Date(timestamp);
    const locale = localStorage.getItem('locale');
    if (locale == 'es'){
      return date.toLocaleDateString('es-ES');
    }else{
      return date.toLocaleDateString('en-US');
    }
   
  }

 getRequirements() {
    return this.trip.requirements;
  }


  goBack() {
    this.router.navigate(['/']);
  }

}
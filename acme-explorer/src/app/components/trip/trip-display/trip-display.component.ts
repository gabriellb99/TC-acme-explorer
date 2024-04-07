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
  countdownInterval: any;
  tripCountdown!: any;

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
    let dateStart:any = this.trip.startedAt;
    let segundos = dateStart.seconds;
    const date = new Date(segundos * 1000).getTime();

    this.countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = date - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));


      this.tripCountdown = `${days}d ${hours}h ${minutes}m`;

      if (distance < 0) {
        clearInterval(this.countdownInterval);
        this.tripCountdown = $localize `Trip has started`;
      }
    }, 1000);

  }

  ngOnDestroy(): void {
    clearInterval(this.countdownInterval);
  }


  transformDate(timestamp: any): string {
    let segundos = timestamp.seconds;
    let date = new Date(segundos * 1000);
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
  
  goToStages(){
    this.router.navigate(['/trips/' + this.id + "/stages"]);
  }

}
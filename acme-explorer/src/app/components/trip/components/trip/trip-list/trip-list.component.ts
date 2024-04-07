import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Trip } from 'src/app/models/trip.model';
import { TripService } from 'src/app/services/trip.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../../../services/auth.service';
import { Actor } from 'src/app/models/actor.model';
import { Router } from '@angular/router';
<<<<<<< Updated upstream
import { SearchService } from 'src/app/services/search.service'; // Importar el servicio de búsqueda
=======
import { Timestamp } from 'firebase/firestore';
>>>>>>> Stashed changes

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent implements OnInit, OnDestroy {

  protected trips!: Trip[];
  protected trash = faTrash;
  protected currentActor: Actor | undefined;
  private searchSubscription: Subscription = new Subscription(); // Inicializar searchSubscription
  searchValue: string = ''; // Definir tipo para el parámetro searchValue
  protected advstatus: boolean = true; // Definición de advstatus

  constructor(private authService: AuthService, private tripService: TripService, private router: Router, private searchService: SearchService) { }

  removeTrip(index: number){
    this.trips[index].cancelReason = "cancelled";
  }
/*
  ngOnInit(): void {
    // Suscribirse al observable searchValue$ del servicio de búsqueda
    this.searchSubscription = this.searchService.searchValue$.subscribe(searchValue => {
      // Realizar la búsqueda y actualizar la lista de trips
      this.searchTrips(searchValue);
    });

    // Obtener todos los viajes disponibles al inicio
    this.tripService.getAllAvailableTrips()
    .then((trips: Trip[]) => {
      this.trips = trips;
<<<<<<< Updated upstream
      // Manejar los datos de los viajes aquí
      console.log('getAllAvailableTrips:', trips);
=======
>>>>>>> Stashed changes
    })
    .catch((error) => {
      // Manejar errores aquí
      console.error('Error fetching trips:', error);
    });

    // Suscribirse al observable searchValue$ del servicio de búsqueda
    this.searchSubscription = this.searchService.searchValue$.subscribe(searchValue => {
      // Realizar la búsqueda y actualizar la lista de trips
      console.log('searchValue:', searchValue);
      this.searchTrips(searchValue);
    });

    // Obtener el actor actual
    this.currentActor = this.authService.getCurrentActor();
  }
*/

ngOnInit(): void {
  // Obtener el actor actual
  this.currentActor = this.authService.getCurrentActor();

  // Suscribirse al observable searchValue$ del servicio de búsqueda
  this.searchSubscription = this.searchService.searchValue$.subscribe(searchValue => {
    // Si hay un valor de búsqueda, realizar la búsqueda
    // De lo contrario, obtener todos los viajes disponibles
    if (searchValue) {
      return this.searchTrips(searchValue);
    } else {
      return this.getAllTrips();
    }
  });
}

// Método para obtener todos los viajes disponibles
getAllTrips(): void {
  this.tripService.getAllAvailableTrips()
    .then((trips: Trip[]) => {
      this.trips = trips;
      // Manejar los datos de los viajes aquí
      console.log('getAllAvailableTrips:', trips);
    })
    .catch((error) => {
      // Manejar errores aquí
      console.error('Error fetching trips:', error);
    });
}


  ngOnDestroy(): void {
    // Desuscribirse del observable al destruir el componente para evitar memory leaks
    this.searchSubscription.unsubscribe();
  }

  checkRole(roles: string): boolean {
    return this.authService.checkRole(roles);
  }

  displayTrip(id: string): void {
    console.log("Displaying: " + id);
    this.router.navigate(['/trips/' + id]);
  }

  newTrip(): void {
    this.router.navigate(['/trips/new']);
  }

  navigateToDatatableView(){
    this.router.navigate(['/trips/dt'])
  }

<<<<<<< Updated upstream
  
  // Método para realizar la búsqueda de trips
  searchTrips(searchValue: string): void {
    // Llamar al método searchTrips del servicio de trips para buscar trips
    this.tripService.searchTrips(searchValue).then(trips => {
      this.trips = trips;
    }).catch(error => {
      console.error("Error al buscar trips:", error);
    });
  }

}
=======
  isTripDateGreaterThan10Days(tripDate: any): boolean {
    const tripDateObject = tripDate.toDate();

    // Obtener la fecha actual
    const today = new Date();

    // Calcular la diferencia en milisegundos entre las fechas
    const differenceInMilliseconds = tripDateObject.getTime() - today.getTime();

    // Calcular el número de días
    const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);

    // Verificar si la diferencia es mayor que 10 días
    return differenceInDays < 7;
  }

}
>>>>>>> Stashed changes

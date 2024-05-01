import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Trip } from 'src/app/models/trip.model';
import { TripService } from 'src/app/services/trip.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../../../services/auth.service';
import { Actor } from 'src/app/models/actor.model';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service'; // Importar el servicio de búsqueda
import { Timestamp } from 'firebase/firestore';
import { MessageService } from 'src/app/services/message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplyCommentComponent } from '../../../apply-comment/apply-comment.component';

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

  constructor(private authService: AuthService, private tripService: TripService, private router: Router, private searchService: SearchService,private messageService: MessageService,private modalService: NgbModal) { }

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
      // Manejar los datos de los viajes aquí
      console.log('getAllAvailableTrips:', trips);
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
  let idUser: string | null = null;
  if(this.currentActor && this.currentActor.role.toLowerCase() === "manager"){
    idUser = this.currentActor.id;
  }

  // Obtener todos los viajes disponibles al inicio
  this.searchSubscription = this.searchService.searchValue$.subscribe(searchValue => {
    // Si hay un valor de búsqueda, realizar la búsqueda
    // De lo contrario, obtener todos los viajes disponibles
    if (searchValue.length > 0) {
      return this.searchTrips(searchValue,idUser);
    } else {
      return this.getAllTrips(idUser);
    }
  });
  return this.getAllTrips(idUser);
}

// Método para obtener todos los viajes disponibles
getAllTrips(idUser: String | null = null): void {
  this.tripService.getAllAvailableTrips(idUser)
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

  navigateToDatatableView(){
    this.router.navigate(['/trips/dt'])
  }

  
  // Método para realizar la búsqueda de trips
  searchTrips(searchValue: string, idUser: string | null = null): void {
    // Llamar al método searchTrips del servicio de trips para buscar trips
    this.tripService.searchTrips(searchValue,idUser).then(trips => {
      this.trips = trips;
    }).catch(error => {
      console.error("Error al buscar trips:", error);
    });
  }


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


    openPopup(index: string){
      console.log("entra", index);
      const modalRef = this.modalService.open(ApplyCommentComponent);
      modalRef.componentInstance.tripId = index;
      modalRef.result.then((result) => {
        if (result === 'save') {
          console.log("aceptar");
          let message = "Item successfully applied";
          this.messageService.notifyMessage(message, "alert alert-success")
        } 
      }).catch((error) => {
        // Manejar errores aquí, si es necesario
        console.log('Error:', error);
      });
    
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
  

}

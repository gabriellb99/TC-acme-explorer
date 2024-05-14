import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Trip } from 'src/app/models/trip.model';
import { TripService } from 'src/app/services/trip.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../../services/auth.service';
import { Actor } from 'src/app/models/actor.model';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/services/search.service'; // Importar el servicio de búsqueda
import { Timestamp } from 'firebase/firestore';
import { MessageService } from 'src/app/services/message.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplyCommentComponent } from '../apply-comment/apply-comment.component';
import { ApplyService } from 'src/app/services/apply.service';
import { TripCommentComponent } from '../trip-comment/trip-comment.component';
import { YesNoQuestionComponent } from '../../shared/yesNoQuestion/yesNoQuestion.component';
import { TimeTrackerService } from 'src/app/services/time-tracker.service';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent implements OnInit, OnDestroy {

  protected trips!: Trip[];
  protected trash = faTrash;
  idUser!:string;
  protected currentActor: Actor | undefined;
  private searchSubscription: Subscription = new Subscription(); // Inicializar searchSubscription
  searchValue: string = ''; // Definir tipo para el parámetro searchValue
  protected advstatus: boolean = true; // Definición de advstatus
  firstTime = new Date().getTime();
  currentUrl: string = window.location.href; 
  

  constructor(private timeTracker: TimeTrackerService, private authService: AuthService, private tripService: TripService, private router: Router, private searchService: SearchService,private messageService: MessageService,private modalService: NgbModal, private applyService:ApplyService) { }

 
ngOnInit(): void {
  

  // Obtener el actor actual
  this.currentActor = this.authService.getCurrentActor();
  if(this.currentActor){
    this.idUser = this.currentActor.id;
  }

  //Obtener el time Tracker o sino tiene crear desde 0


  // Obtener todos los viajes disponibles al inicio
  this.searchSubscription = this.searchService.searchValue$.subscribe(searchValue => {
    // Si hay un valor de búsqueda, realizar la búsqueda
    // De lo contrario, obtener todos los viajes disponibles
    if (searchValue.length > 0) {
      return this.searchTrips(searchValue,this.idUser);
    } else {
      return this.getAllTrips(this.idUser);
    }
  });
  return this.getAllTrips(this.idUser);
}

// Método para obtener todos los viajes disponibles
getAllTrips(idUser: String | null = null): void {
  this.tripService.getAllAvailableTrips(idUser)
    .then(async (trips: Trip[]) => {
      this.trips = trips;
      for (const trip of this.trips) {
        trip.hasAcceptedApplications = await this.hasAcceptedApplications(trip.id);
      }
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
    //Antes de salir creamos o actualizamos el tiempo para que se quede guardado el total 
    let lastTime = new Date().getTime();
    let totalTime = lastTime - this.firstTime;
    this.timeTracker.createorUpdateUrlTime(this.currentUrl, this.idUser, totalTime);
  };

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
    this.tripService.searchTrips(searchValue,idUser).then(async trips => {
      this.trips = trips;
      for (const trip of this.trips) {
        trip.hasAcceptedApplications = await this.hasAcceptedApplications(trip.id);
      }
    }).catch(error => {
      console.error("Error al buscar trips:", error);
    });
  }


  isTripDateGreaterEqThan10Days(tripDate: any): boolean {
    const tripDateObject = tripDate.toDate();

    // Obtener la fecha actual
    const today = new Date();

    // Calcular la diferencia en milisegundos entre las fechas
    const differenceInMilliseconds = tripDateObject.getTime() - today.getTime();

    // Calcular el número de días
    const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);

    // Verificar si la diferencia es mayor que 10 días
    return differenceInDays >= 10;
  }

  isTripDateGreaterThan7Days(tripDate: any): boolean {
    const tripDateObject = tripDate.toDate();
    const today = new Date();
    const differenceInMilliseconds = tripDateObject.getTime() - today.getTime();
    const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);
    return differenceInDays > 7;
  }

  isTripDateLessThan7Days(tripDate: any): boolean {
    const tripDateObject = tripDate.toDate();
    const today = new Date();
    const differenceInMilliseconds = tripDateObject.getTime() - today.getTime();
    const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);
    return differenceInDays < 7;
  }

  async hasAcceptedApplications(tripId: string){
    const applications = await this.applyService.getAllAcceptedApplicationsByTrip(tripId);
    const res = applications.length > 0;
    console.log("tiene",res);
    return res;
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


    removeTrip(index: string){
      console.log('removeTrip');
      const modalRef = this.modalService.open(YesNoQuestionComponent);
      modalRef.componentInstance.title = 'Remove trip';
      modalRef.componentInstance.message = 'Are you sure you want to remove this trip?';
      modalRef.result.then(async (result) => {
        console.log(result);
        if (result === 'confirm') {
          await this.tripService.deleteTrip(index);
          let message = "Trip successfully deleted";
          this.messageService.notifyMessage(message, "alert alert-success")
          await this.getAllTrips(this.idUser);
        }
      });
    }

    async openPopupCancel(index: string){
      const modalRef = this.modalService.open(TripCommentComponent);
      modalRef.componentInstance.tripId = index;
      modalRef.result.then(async (result) => {
        if (result === 'save') {
          console.log('save list component');
          await this.getAllTrips(this.idUser);
          let message = "Trip successfully cancelled";
          this.messageService.notifyMessage(message, "alert alert-success")
        } 
      }).catch((error) => {
        console.log('Error:', error);
      });
    }
  

}

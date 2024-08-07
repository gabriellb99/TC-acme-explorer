import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionType } from '@swimlane/ngx-datatable';
import { Actor } from 'src/app/models/actor.model';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { TripService } from 'src/app/services/trip.service';
import { MessageService } from 'src/app/services/message.service';
import { Timestamp } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';
import { ApplyService } from 'src/app/services/apply.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplyCommentComponent } from '../apply-comment/apply-comment.component';
import { YesNoQuestionComponent } from '../../shared/yesNoQuestion/yesNoQuestion.component';
import { TripCommentComponent } from '../trip-comment/trip-comment.component';

@Component({
  selector: 'app-trip-table',
  templateUrl: './trip-table.component.html',
  styleUrls: ['./trip-table.component.css']
})
export class TripTableComponent implements OnInit {

  trips!: Trip[];
  idUser!: string;
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
  private searchSubscription: Subscription = new Subscription(); // Inicializar searchSubscription
  searchValue: string = ''; // Definir tipo para el parámetro searchValue
  protected advstatus: boolean = true; // Definición de advstatus


  constructor(private authService: AuthService, private tripService: TripService, private router: Router, private messageService: MessageService,private searchService: SearchService, private applyService: ApplyService,private modalService: NgbModal) { }

  async ngOnInit(): Promise<void> {
     // Obtener el actor actual
  this.currentActor = this.authService.getCurrentActor();
  if(this.currentActor && this.currentActor.role.toLowerCase() === "manager"){
    this.idUser = this.currentActor.id;
  }

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

  async removeTrip(index: string, startedAt: Timestamp){
    if (this.isTripDateGreaterEqThan10Days(startedAt) && !this.hasAcceptedApplications(index)) {
      const modalRef = this.modalService.open(YesNoQuestionComponent);
      modalRef.componentInstance.title = 'Remove trip';
      modalRef.componentInstance.message = 'Are you sure you want to remove this trip?';
      modalRef.result.then(async (result) => {
        console.log(result);
        if (result === 'confirm') {
          await this.tripService.deleteTrip(index);
          let message = $localize`Trip successfully deleted`;
          this.messageService.notifyMessage(message, "alert alert-success")
          await this.getAllTrips(this.idUser);
        }
      });
      
      
    } else {
      let message = $localize`Trip can not be deleted`;
      this.messageService.notifyMessage(message, "alert alert-danger")
    }
  }

  isTripDateGreaterEqThan10Days(tripDate: any): boolean {
    const tripDateObject = tripDate.toDate();
    const today = new Date();
    const differenceInMilliseconds = tripDateObject.getTime() - today.getTime();
    const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);
    return differenceInDays >= 10;
  }

  isTripDateGreaterThan7Days(tripDate: any): boolean {
    const tripDateObject = tripDate.toDate();
    const today = new Date();
    const differenceInMilliseconds = tripDateObject.getTime() - today.getTime();
    const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);
    return differenceInDays > 7;
  }

  async hasAcceptedApplications(tripId: string){
    const applications = await this.applyService.getAllAcceptedApplicationsByTrip(tripId);    
    const res = applications.length > 0;
    console.log("tiene: ",res);
    return res;
  }

  async openPopupCancel(index: string, startedAt: Timestamp){
    let canNotBeCancelled = await this.hasAcceptedApplications(index);
    console.log(canNotBeCancelled);
    console.log(this.isTripDateGreaterThan7Days(startedAt));
    if (this.isTripDateGreaterThan7Days(startedAt) && !canNotBeCancelled){ 
      const modalRef = this.modalService.open(TripCommentComponent);
      modalRef.componentInstance.tripId = index;
      modalRef.result.then(async (result) => {
        if (result === 'save') {
          await this.getAllTrips(this.idUser);
          let message = $localize`Trip successfully cancelled`;
          this.messageService.notifyMessage(message, "alert alert-success")
        } 
      }).catch((error) => {
        console.log('Error:', error);
      });
    } else {
      console.log('Error: no se puede cancelar');
      let message = $localize`Trip can not be cancelled`;
      this.messageService.notifyMessage(message, "alert alert-danger")
    }
  }


  openPopup(index: string){
    console.log("entra", index);
    const modalRef = this.modalService.open(ApplyCommentComponent);
    modalRef.componentInstance.tripId = index;
    modalRef.result.then((result) => {
      if (result === 'save') {
        console.log("aceptar");
        let message = "Trip successfully applied";
        this.messageService.notifyMessage(message, "alert alert-success")
      } 
    }).catch((error) => {
      // Manejar errores aquí, si es necesario
      console.log('Error:', error);
    });
  
  }

  transformDate(timestamp: Timestamp): string {
    let date = new Date(timestamp.seconds * 1000);
    const locale = localStorage.getItem('locale');
    if (locale == 'es'){
      return date.toLocaleDateString('es-ES');
    }else{
      return date.toLocaleDateString('en-US');
    }
   
  }


  getRowColor(row: any) {
    const tripDateObject = row.startedAt.toDate();

    // Obtener la fecha actual
    const today = new Date();

    // Calcular la diferencia en milisegundos entre las fechas
    const differenceInMilliseconds = tripDateObject.getTime() - today.getTime();

    // Calcular el número de días
    const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);
    if (Math.floor(differenceInDays) < 7){
      return 'row-highlight';
    }else{
      return '';
    }
  }

  getAllTrips(idUser: String | null = null): void {
    this.tripService.getAllAvailableTrips(idUser)
      .then((trips: Trip[]) => {
        this.trips = trips;
        // Manejar los datos de los viajes aquí
        //console.log('getAllAvailableTrips:', trips);
      })
      .catch((error) => {
        // Manejar errores aquí
        console.error('Error fetching trips:', error);
      });
  }

  searchTrips(searchValue: string, idUser: string | null = null): void {
    // Llamar al método searchTrips del servicio de trips para buscar trips
    this.tripService.searchTrips(searchValue,idUser).then(trips => {
      this.trips = trips;
    }).catch(error => {
      console.error("Error al buscar trips:", error);
    });
  }

  displayTrip(tripId: string) {
    this.router.navigate(['/trips/', tripId]);
  }

}

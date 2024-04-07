import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SelectionType } from '@swimlane/ngx-datatable';
import { Actor } from 'src/app/models/actor.model';
import { Trip } from 'src/app/models/trip.model';
import { AuthService } from 'src/app/services/auth.service';
import { TripService } from 'src/app/services/trip.service';
import { MessageService } from 'src/app/services/message.service';
import { Timestamp } from 'firebase/firestore';

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


  constructor(private authService: AuthService, private tripService: TripService, private router: Router, private messageService: MessageService) { }

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
        //console.log('Trips:', trips);
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

  removeTrip(index: number){
    this.trips[index].cancelReason = "cancelled";
    let message = "Item successfully deleted";
    this.messageService.notifyMessage(message, "alert alert-success")
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

  isTripDateGreaterThan10Days(tripDate: any): boolean {
    const tripDateObject = tripDate.toDate();

    const today = new Date();

    const differenceInMilliseconds = tripDateObject.getTime() - today.getTime();

    const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);

    return differenceInDays < 10;
  }

  getRowColor(row: any) {
    const tripDateObject = row.startedAt.toDate();

    // Obtener la fecha actual
    const today = new Date();

    // Calcular la diferencia en milisegundos entre las fechas
    const differenceInMilliseconds = tripDateObject.getTime() - today.getTime();

    // Calcular el número de días
    const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);
    console.log(differenceInDays)

    if (Math.floor(differenceInDays) < 7){
      return 'row-highlight';
    }else{
      console.log('entra aqui')
      return '';
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { Trip } from 'src/app/models/trip.model';

@Component({
  selector: 'app-trip-display',
  templateUrl: './trip-display.component.html',
  styleUrls: ['./trip-display.component.css']
})
export class TripDisplayComponent implements OnInit {

  public trip: Trip;

  constructor() { 
    this.trip = new Trip();
    this.trip.ticker = 'VI-123';
    this.trip.title = 'Punta Cana';
    this.trip.description = 'Gran viaje a un sitio paradisiaco';
    this.trip.price = 123;
    this.trip.requirements = ['Llevar crema solar', 'Pasarlo bien', 'Tomar mucho el sol'];
    this.trip.startedAt = new Date('2024-03-15');
    this.trip.endAt = new Date('2024-03-25');
    this.trip.cancelReason = '';
    this.trip.photos = ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuwFKwx9FE8D82cONDRPwYuj-xNSjVmyJfDw&usqp=CAU', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF5fUUe6vXn77s-W1HET2YT3fRdOJib3xwDA&usqp=CAU', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFZhlSPtMtO3cMwY88jGt--dTKhVGdj9Pyrw&usqp=CAU'];
  }

  getRequirements() {
    return this.trip.requirements;
  }

  /*getFormattedDate(fecha:Date){
    const dia = fecha.getDay();
    const mes = fecha.getMonth() + 1; 
    const anio = fecha.getFullYear(); 
    const diaFormateado = dia < 10 ? '0' + dia : dia.toString();
    const mesFormateado = mes < 10 ? '0' + mes : mes.toString(); 
    let fechaFormateada = `${diaFormateado}-${mesFormateado}-${anio}`;
    return fechaFormateada
  }*/

  ngOnInit(): void {
  }

}

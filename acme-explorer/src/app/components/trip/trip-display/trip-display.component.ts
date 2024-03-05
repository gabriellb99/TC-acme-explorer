import { Component, OnInit } from '@angular/core';
import { Trip } from 'src/app/models/trip.model';

@Component({
  selector: 'app-trip-display',
  templateUrl: './trip-display.component.html',
  styleUrls: ['./trip-display.component.css']
})
export class TripDisplayComponent implements OnInit {

  protected trip: Trip;

  constructor() { 
    this.trip = new Trip();
    this.trip.ticker = 'VI-123';
    this.trip.title = 'Punta Cana';
    this.trip.description = 'Gran viaja a un sitio paradisiaco';
    this.trip.price = 123;
    this.trip.requirements = ['Llevar crema solar', 'Pasarlo bien', 'Tomar mucho el sol'];
    this.trip.startedAt = new Date('2024-03-15');;
    this.trip.endAt = new Date('2024-03-25');;
    this.trip.cancelReason = '';
    this.trip.photos = ['Llevar crema solar', 'Pasarlo bien', 'Tomar mucho el sol'];
  }

  getRequirements() {
    return this.trip.requirements;
  }

  getFormattedDate(fecha:Date){
    const dia = this.trip.startedAt.getDate();
    const mes = fecha.getMonth() + 1; 
    const anio = fecha.getFullYear(); 
    const diaFormateado = dia < 10 ? '0' + dia : dia.toString();
    const mesFormateado = mes < 10 ? '0' + mes : mes.toString(); 
    let fechaFormateada = `${diaFormateado}-${mesFormateado}-${anio}`;
    return fechaFormateada
  }

  ngOnInit(): void {
  }

}

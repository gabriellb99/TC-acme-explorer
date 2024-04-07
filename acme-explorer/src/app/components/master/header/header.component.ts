import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Actor } from 'src/app/models/actor.model';
import { $localize } from '@angular/localize/init';
import { SearchService } from 'src/app/services/search.service'; // Importar el servicio de búsqueda
import { TripService } from 'src/app/services/trip.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('logoutAnimation', [
      state('open', style({
        transform: 'scale(1)',
        opacity: 1
      })),
      state('closed', style({
        transform: 'scale(0.5)',
        opacity: 0
      })),
      transition('open => closed', [
        animate('0.5s')
      ]),
      transition('closed => open', [
        animate('0.5s')
      ])
    ])
  ]
  
})


export class HeaderComponent implements OnInit {
  logoutAnimationState = 'closed';
  protected currentActor: Actor | undefined;
  protected activeRole: string = 'anonymous';
  private returnUrl!: string;

  
  //constructor(private authService: AuthService){ }

  constructor(private authService:AuthService, private tripService: TripService, private router: Router, private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.authService.getStatus().subscribe((loggedIn: Boolean) =>{
      if(loggedIn){
        this.currentActor = this.authService.getCurrentActor();
        this.activeRole = this.currentActor.role.toString().toLowerCase();
      }else{
        this.activeRole = 'anonymous';
        this.currentActor = undefined;
      }
    })
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  async logout() {
    try {
      //let msg = $localize `Logging out`;
      await this.authService.logout();
      this.logoutAnimationState = 'open';
      console.log("Logging out");
    } catch (error) {
      console.error(error);
    }
  }

  cerrarAnimacion() {
    this.logoutAnimationState = 'closed'; // Cambia el estado para cerrar la animación
  }

  changeLanguage(language: string) {
    localStorage.setItem('locale', language);
    location.reload();
  }


  async onSearch(form: NgForm) {
    const searchValue = form.value.searchValue;
    console.log("patron busqueda:" + searchValue);
    
    try {
      // Llama al servicio de búsqueda con los parámetros especificados
      const trips = await this.tripService.searchTrips(searchValue);
      
      // Realiza alguna acción con los viajes encontrados
      console.log("Trips encontrados:", trips);
      
      // Reinicia el formulario después de realizar la búsqueda
      form.resetForm(); // Utiliza resetForm() para resetear solo el formulario


      
      // Redirige a la página correspondiente después de realizar la búsqueda    
      this.router.navigateByUrl(this.returnUrl);
    } catch (error) {
      // Maneja el error si la búsqueda falla
      console.error("Error al realizar la búsqueda:", error);
    }
  }
  



}

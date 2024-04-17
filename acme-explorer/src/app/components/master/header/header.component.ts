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
  loginUser!: any;

  
  //constructor(private authService: AuthService){ }

  constructor(private authService:AuthService, private tripService: TripService, private router: Router, private route: ActivatedRoute, private searchService: SearchService) {
    this.currentActor = this.authService.getCurrentActor();
    if(this.currentActor == null){
      this.activeRole = 'anonymous';
    } else {
      this.activeRole = this.currentActor.role.toString().toLowerCase();
    }
  }


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
      this.activeRole = 'anonymous';
      this.currentActor = undefined;
      this.logoutAnimationState = 'open';
      console.log("Logging out");
    } catch (error) {
      console.error(error);
    }
  }

  editUser() {
    console.log(this.authService.getUser())
    this.loginUser = this.authService.getUser();
    this.router.navigate([`register/${this.loginUser._id}`])
  }

  cerrarAnimacion() {
    this.logoutAnimationState = 'closed'; // Cambia el estado para cerrar la animación
  }

  changeLanguage(language: string) {
    localStorage.setItem('locale', language);
    location.reload();
  }


  onSearch(form: NgForm) {
    const searchValue = form.value.searchValue;
    this.searchService.searchValue$.next(searchValue); // Emitir el valor de búsqueda al servicio
  }

}


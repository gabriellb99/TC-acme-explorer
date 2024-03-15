import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
  constructor(private authService: AuthService){ }

  ngOnInit(): void {
  }

  async logout() {
    try {
      await this.authService.logout();
      this.logoutAnimationState = 'open';
      console.log("Logout Completo");
    } catch (error) {
      console.error(error);
    }
  }

  cerrarAnimacion() {
    this.logoutAnimationState = 'closed'; // Cambia el estado para cerrar la animación
  }

}

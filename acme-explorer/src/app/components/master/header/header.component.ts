import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService){ }

  ngOnInit(): void {
  }

  async logout() {
    try {
      await this.authService.logout();
      console.log("Logout Completo");
    } catch (error) {
      console.error(error);
    }
  }

}

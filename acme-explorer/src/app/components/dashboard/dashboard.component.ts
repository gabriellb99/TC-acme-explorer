import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  roleList: string [];

  constructor(private authService: AuthService) { 
      this.roleList = this.authService.getRoles();      
    }

  ngOnInit(): void {
  }

  
  checkRole(roles: string): boolean {
    return this.authService.checkRole(roles);
  }

  

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  roleList: string [];
  data = [];

  constructor(private authService: AuthService, private dashboardService: DashboardService) { 
      this.roleList = this.authService.getRoles();   
      this.data = [];   
    }

  ngOnInit(): void {
    this.dashboardService.getGeneralInformationTrips().then(value => {
      this.data.push(value);
    })
    this.dashboardService.getGeneralInformationApplications().then(value => {
      this.data.push(value);
    })
    this.dashboardService.getGeneralInformationPrice().then(value => {
      this.data.push(value);
    })
  }

  
  checkRole(roles: string): boolean {
    return this.authService.checkRole(roles);
  }

  

}

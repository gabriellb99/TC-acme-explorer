import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from 'src/app/services/dashboard.service';

interface GeneralInformationData {
  tripsPerManager: any;
  applicationsPerTrip: any;
  tripPrices: any;
  applicationsRatio: any;
  icon: String;
  bgcolor: String;
  btcolor: String
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  roleList: string [];
  data: GeneralInformationData[] = [];

  constructor(private authService: AuthService, private dashboardService: DashboardService) { 
      this.roleList = this.authService.getRoles();   
      this.data = [];   
    }

    async ngOnInit(): Promise<void> {
      try {
        const value: any[] = await this.dashboardService.generalInformation();
        const generalInformationData: GeneralInformationData = value[0]; 
          
        this.data.push(generalInformationData);
        console.log("ngOnInit:", this.data);
      } catch (error) {
        console.error('Error en ngOnInit:', error);
      }
    } 
  
    checkRole(roles: string): boolean {
      return this.authService.checkRole(roles);
    }  

}

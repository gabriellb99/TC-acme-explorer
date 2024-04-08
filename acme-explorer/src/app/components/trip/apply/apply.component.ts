import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApplyService } from 'src/app/services/apply.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Application } from 'src/app/models/application.model';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.css']
})
export class ApplyComponent implements OnInit {

  protected applications!: Application[];

  constructor(private authService: AuthService, private applyService: ApplyService, private router: Router) { }


  ngOnInit(): void {
    this.getAllApplications();
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

  async getAllApplications(): Promise<void> {
    this.applications = await this.applyService.getAllApplications(); 
        console.log("service-getAllApplications:" , this.applications.length);    
  }

}



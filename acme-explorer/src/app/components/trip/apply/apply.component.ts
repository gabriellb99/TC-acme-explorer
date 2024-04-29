import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApplyService } from 'src/app/services/apply.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Application } from 'src/app/models/application.model';
import { Timestamp } from 'firebase/firestore';
import { Actor } from 'src/app/models/actor.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplyCommentComponent } from '../apply-comment/apply-comment.component';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.css']
})
export class ApplyComponent implements OnInit {

  protected applications!: Application[];
  userId!: string;
  userRole!: string;

  constructor(private authService: AuthService, private applyService: ApplyService, private router: Router,private modalService: NgbModal) { 
    const currentActor = this.authService.getCurrentActor();
    if(currentActor){
      this.userId = currentActor.id;
      this.userRole = currentActor.role.toUpperCase();
    }
  }


  async ngOnInit(): Promise<void> {
    await this.getApplicationsByRole();
    
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

  async getApplicationsByRole(): Promise<void> {
    if(this.userRole.toLowerCase() === "manager"){
      return await this.getAllManagerApplications();
    }else if(this.userRole.toLowerCase() === "explorer"){
      return this.getAllExplorerApplications();
    }else{
      return this.getAllManagerApplications();
    }
  }

  async getAllApplications(): Promise<void> {
    this.applications = await this.applyService.getAllApplications(); 
        console.log("service-getAllApplications:" , this.applications.length);    
  }

  async getAllManagerApplications(): Promise<void> {
    this.applications = await this.applyService.getAllManagerApplications(this.userId); 
        console.log("service-getAllApplications:" , this.applications);    
  }

  async getAllExplorerApplications(): Promise<void> {
    this.applications = await this.applyService.getAllExplorerApplications(this.userId); 
        console.log("service-getAllApplications:" , this.applications);    
  }

  cancel(applicationId : string) : void {

  }

  async accept(applicationId : string) : Promise<void> {
    console.log("accept application");
    await this.applyService.acceptApplication(applicationId);
    //actualizamos las applications
    await this.getApplicationsByRole();
  }

  reject(applicationId : string) : void {
    const modalRef = this.modalService.open(ApplyCommentComponent);
      modalRef.componentInstance.applicationId = applicationId;
      modalRef.componentInstance.mode = "reject";
      modalRef.result.then(async (result) => {
        if (result === 'save') {
          console.log("reject success");
          await this.getApplicationsByRole();
          
        } 
      }).catch((error) => {
        // Manejar errores aquí, si es necesario
        console.log('Error:', error);
      });
  }

  pay(applicationId : string) : void {
    
  }

}



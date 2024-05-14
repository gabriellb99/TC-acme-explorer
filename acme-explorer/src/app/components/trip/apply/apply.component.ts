import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApplyService } from 'src/app/services/apply.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Application } from 'src/app/models/application.model';
import { Timestamp } from 'firebase/firestore';
import { Actor } from 'src/app/models/actor.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplyCommentComponent } from '../apply-comment/apply-comment.component';
import { YesNoQuestionComponent } from '../../shared/yesNoQuestion/yesNoQuestion.component';
import { TripService } from 'src/app/services/trip.service';
import { Trip } from 'src/app/models/trip.model';
import { TimeTrackerService } from 'src/app/services/time-tracker.service';

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.css']
})
export class ApplyComponent implements OnInit {

  protected applications!: Application[];
  userId!: string;
  userRole!: string;
  firstTime = new Date().getTime();
  currentUrl: string = window.location.href; 
  protected currentActor: Actor | undefined;
  idUser!:string;

  constructor(private timeTracker: TimeTrackerService, private authService: AuthService, private applyService: ApplyService, private router: Router,private modalService: NgbModal,private tripService: TripService) { 
    const currentActor = this.authService.getCurrentActor();
    if(currentActor){
      this.userId = currentActor.id;
      this.userRole = currentActor.role.toUpperCase();
    }
  }


  async ngOnInit(): Promise<void> {
    await this.getApplicationsByRole();
    this.currentActor = this.authService.getCurrentActor();
  if(this.currentActor){
    this.idUser = this.currentActor.id;
  }
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
    console.log("buscando application");
    if(this.userRole.toLowerCase() === "manager"){
      return await this.getAllManagerApplications();
    }else if(this.userRole.toLowerCase() === "explorer"){
      return this.getAllExplorerApplications();
    }else{
      return this.getAllManagerApplications();
    }
  }

  async getAllApplications(): Promise<void> {
    const applications = await this.applyService.getAllApplications(); 
    for (const application of applications) {
      this.tripService.getTripById(application.trip).subscribe(
        (trip: Trip | null) => {
          if (trip) {
            application.startTripDate = trip.startedAt;
            application.tripPrice = trip.price;
            application.tripTitle = trip.title;
            if(trip.cancelReason !== ""){
              console.log("entra en deleted");
              application.tripDeletedOrCancel = true;
            }else{
              application.tripDeletedOrCancel = false;
            }
           
          } else {
            application.tripDeletedOrCancel = true;
            console.warn('Trip not found for application:', application.id);
          }
        },
        error => {
          console.error('Error fetching trip:', error);
        }
      );
      this.authService.getActorById(application.actorId).then(
        (actor: Actor | null) => {
          if (actor) {
            let actorDescription = actor.name + ' ' + actor.surname;
            application.actorDescription = actorDescription;
          } else {
            console.warn('Actor not found for application:', application.id);
          }
        },
        error => {
          console.error('Error fetching actor:', error);
        }
      );
    }
    this.applications = applications; 
  }

  async getAllManagerApplications(): Promise<void> {
    const applications = await this.applyService.getAllManagerApplications(this.userId); 
    for (const application of applications) {
      this.tripService.getTripById(application.trip).subscribe(
        (trip: Trip | null) => {
          if (trip) {
            application.startTripDate = trip.startedAt;
            application.tripPrice = trip.price;
            application.tripTitle = trip.title;
            if(trip.cancelReason !== ""){
              console.log("entra en deleted");
              application.tripDeletedOrCancel = true;
            }else{
              application.tripDeletedOrCancel = false;
            }
           
          } else {
            application.tripDeletedOrCancel = true;
            console.warn('Trip not found for application:', application.id);
          }
         
        },
        error => {
          console.error('Error fetching trip:', error);
        }
      );
      this.authService.getActorById(application.actorId).then(
        (actor: Actor | null) => {
          if (actor) {
            let actorDescription = actor.name + ' ' + actor.surname;
            application.actorDescription = actorDescription;
          } else {
            console.warn('Actor not found for application:', application.id);
          }
        },
        error => {
          console.error('Error fetching actor:', error);
        }
      );
    }
    this.applications = applications;
  }

  async getAllExplorerApplications(): Promise<void> {
    const applications = await this.applyService.getAllExplorerApplications(this.userId); 
    for (const application of applications) {
      this.tripService.getTripById(application.trip).subscribe(
        (trip: Trip | null) => {
          if (trip) {
            application.startTripDate = trip.startedAt;
            application.tripPrice = trip.price;
            application.tripTitle = trip.title;
            if(trip.cancelReason !== ""){
              console.log("entra en deleted");
              application.tripDeletedOrCancel = true;
            }else{
              application.tripDeletedOrCancel = false;
            }
           
          } else {
            application.tripDeletedOrCancel = true;
            console.warn('Trip not found for application:', application.id);
          }
        },
        error => {
          console.error('Error fetching trip:', error);
        }
      );
      this.authService.getActorById(application.actorId).then(
        (actor: Actor | null) => {
          if (actor) {
            let actorDescription = actor.name + ' ' + actor.surname;
            application.actorDescription = actorDescription;
          } else {
            console.warn('Actor not found for application:', application.id);
          }
        },
        error => {
          console.error('Error fetching actor:', error);
        }
      );
    }
    this.applications = applications;
  }

  cancel(applicationId : string) : void {
    const modalRef = this.modalService.open(YesNoQuestionComponent);
    modalRef.componentInstance.title = 'Cancel application';
    modalRef.componentInstance.message = 'Are you sure you want to cancel this application?';
    modalRef.result.then(async (result) => {
      console.log(result);
      if (result === 'confirm') {
        await this.applyService.deleteApplication(applicationId);
        await this.getApplicationsByRole();
      }
    });
  
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

  ngOnDestroy(): void {
    //Antes de salir creamos o actualizamos el tiempo para que se quede guardado el total 
    let lastTime = new Date().getTime();
    let totalTime = lastTime - this.firstTime;
    this.timeTracker.createorUpdateUrlTime(this.currentUrl, this.idUser, totalTime);
  }


}



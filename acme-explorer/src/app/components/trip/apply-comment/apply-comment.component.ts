import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApplyService } from 'src/app/services/apply.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Application } from 'src/app/models/application.model';
import { Timestamp } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-apply-comment',
  templateUrl: './apply-comment.component.html',
  styleUrls: ['./apply-comment.component.css']
})
export class ApplyCommentComponent {
  comment: string = '';
  @Input() tripId!: string;
  userId : string = '';
  mode : string = 'apply';
  applicationId: string = '';

  constructor(private authService: AuthService, private activeModal: NgbActiveModal, private applyService: ApplyService) {
    console.log('applyService');
    this.userId = this.authService.getCurrentActor().id;
  }

  async saveApplication(): Promise<void> {
    try{
      await this.applyService.createApplication(this.userId,this.tripId,this.comment);
      console.log('Comentario guardado:', this.comment, ' para el viaje ', this.tripId, 'c con solicitante ', this.userId);
      this.activeModal.close('save');
    }catch(err){
      console.log(err);
    }

  }

  async rejectApplication() {
    console.log("reject application");
    await this.applyService.rejectApplication(this.applicationId,this.comment);
    this.activeModal.close('save');
  }

    cancel():void {
      this.activeModal.dismiss('cancel');
    }
  
}


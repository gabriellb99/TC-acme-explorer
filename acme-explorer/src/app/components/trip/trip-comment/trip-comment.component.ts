import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TripService } from 'src/app/services/trip.service';

@Component({
  selector: 'app-trip-comment',
  templateUrl: './trip-comment.component.html',
  styleUrls: ['./trip-comment.component.css']
})
export class TripCommentComponent{

  comment: string = '';
  @Input() tripId!: string;
  
  constructor(private activeModal: NgbActiveModal, private tripService: TripService) { }

  async cancelTrip() {
    console.log("cancelTrip");
    await this.tripService.cancelTrip(this.tripId,this.comment);
    this.activeModal.close('save');
  }


  cancel():void {
    this.activeModal.dismiss('cancel');
  }

}

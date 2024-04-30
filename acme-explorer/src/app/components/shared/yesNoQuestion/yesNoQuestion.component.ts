import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-yesNoQuestion',
  templateUrl: './yesNoQuestion.component.html',
  styleUrls: ['./yesNoQuestion.component.css']
})
export class YesNoQuestionComponent {

  @Input() title!: string;
  @Input() message!: string;

  constructor(public activeModal: NgbActiveModal) { }

  confirm(): void {
    this.activeModal.close('confirm');
  }

  dismiss(reason: string): void {
    this.activeModal.dismiss(reason);
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  protected today!:string;
  visitorNumber!: number;

  constructor() { }

  ngOnInit(): void {

  let dateObject = new Date(); 
    const locale = localStorage.getItem('locale');
    if (locale == 'es'){
      this.today = dateObject.toLocaleDateString('es-ES');
    }else{
      this.today = dateObject.toLocaleDateString('en-US');
    }
  }
}

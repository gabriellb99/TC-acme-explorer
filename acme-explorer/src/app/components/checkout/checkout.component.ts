import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { ApplyService } from 'src/app/services/apply.service';
import { TimeTrackerService } from 'src/app/services/time-tracker.service';
import { AuthService } from '../../services/auth.service';
import { Actor } from 'src/app/models/actor.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  protected payPalConfig ?: IPayPalConfig
  applicationId!: string;
  firstTime = new Date().getTime();
  currentUrl: string = window.location.href; 
  protected currentActor: Actor | undefined;
  idUser!:string;

  constructor(private timeTracker: TimeTrackerService, private authService: AuthService, private route:ActivatedRoute, private router : Router, private applyService: ApplyService) { }

  ngOnInit(): void {
    this.currentActor = this.authService.getCurrentActor();
  if(this.currentActor){
    this.idUser = this.currentActor.id;
  }
    this.route.queryParams.subscribe(params => {
      this.applicationId = params['applicationId'];
    });
    console.log("applicationId: " + this.applicationId);
    this.initConfig();
  }

  private initConfig(): void {
    //const total = this.route.snapshot.queryParams['total'];
    const total = '100';
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'AV6py2GJBX6y2baeVVaOVO3Fy_3UATVp_JetzVdylMl2K3fsu4HtLzTLeTrAreQV2rxlQ9vo1__8BCbT',
      createOrderOnClient: (data) => < ICreateOrderRequest > {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: total,
          }
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('Order details:', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - inform your server at this point', data);
        let message = $localize `The application has been paid`;
        alert(message);
        this.onCompletePayment();
        
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('OnClick', data, actions);
      }
    };
  }
  onCompletePayment() : void{
    console.log('Pago completado. Ejecutando función después del pago...');
    this.applyService.afterPaidApplication(this.applicationId).then(() => {
      console.log('Estado de la aplicación actualizado correctamente.');
      this.router.navigateByUrl('/applies');
    }).catch(error => {
      console.error('Error al actualizar el estado de la aplicación:', error);
    });
  }

  ngOnDestroy(): void {
    //Antes de salir creamos o actualizamos el tiempo para que se quede guardado el total 
    let lastTime = new Date().getTime();
    let totalTime = lastTime - this.firstTime;
    this.timeTracker.createorUpdateUrlTime(this.currentUrl, this.idUser, totalTime);
  }

}

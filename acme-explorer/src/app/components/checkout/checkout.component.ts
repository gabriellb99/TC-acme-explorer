import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { ApplyService } from 'src/app/services/apply.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  protected payPalConfig ?: IPayPalConfig
  applicationId!: string;
  
  constructor(private route:ActivatedRoute, private router : Router, private applyService: ApplyService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.applicationId = params['applicationId'];
    });
    console.log("applicationId: " + this.applicationId);
    this.initConfig();
  }

  private initConfig(): void {
    const total = this.route.snapshot.queryParams['priceTrip'];
    console.log(this.route.snapshot.queryParams);
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
        //console.log('onApprove - transaction approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('Order details:', details);
        });
      },
      onClientAuthorization: (data) => {
        //console.log('onClientAuthorization - inform your server at this point', data);
        let message = $localize `The application has been paid`;
        alert(message);
        this.onCompletePayment();
        
      },
      onCancel: (data, actions) => {
        //console.log('OnCancel', data, actions);
      },
      onError: err => {
        //console.log('OnError', err);
      },
      onClick: (data, actions) => {
        //console.log('OnClick', data, actions);
      }
    };
  }
  onCompletePayment() : void{
    //console.log('Pago completado. Ejecutando función después del pago...');
    this.applyService.afterPaidApplication(this.applicationId).then(() => {
      //console.log('Estado de la aplicación actualizado correctamente.');
      this.router.navigateByUrl('/applies');
    }).catch(error => {
      console.error('Error al actualizar el estado de la aplicación:', error);
    });
  }

}

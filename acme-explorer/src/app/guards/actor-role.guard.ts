import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActorRoleGuard {
  

  constructor(private authService: AuthService, private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
      Observable<boolean | UrlTree> 
      | Promise<boolean | UrlTree> 
      | boolean 
      | UrlTree {
        return new Promise ((resolve,reject) => {
          const expectedRole = route.data['expectedRole'];
          const currentActor = this.authService.getCurrentActor();
          let result = false;
          if(currentActor){            
            const activeRole = new RegExp(currentActor.role.toString().toLocaleLowerCase(), 'i');
            console.log ("activeRole:" + activeRole + " ,expectedRole: " + expectedRole);
            if(expectedRole.search(activeRole) !== -1) {
              result = true;
            }else{
              this.router.navigate(['denied-access'],
              {queryParams: {previousURL: state.url}})
            }
            resolve(result);
          } else {
            if (expectedRole.indexOf('anonymous') !== -1){
              result = true;
            } else {
              this.router.navigate(['login'],
                {queryParams: {returnUrl: state.url}})
            }
            resolve(result);
          }
        });
  }
}

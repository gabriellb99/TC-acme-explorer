/// <reference types="cypress" />

import { FirebaseAppModule } from "@angular/fire/app";
import { Auth } from "@angular/fire/auth";
import { AuthService } from "src/app/services/auth.service";


 declare global {  
  namespace Cypress {
    interface Chainable {
      getAppComponentAndSetValue(selector: string, propName: string, propValue: any): Chainable<Element>
    }
  }
}

  Cypress.Commands.add('getAppComponentAndSetValue', (selector: string, propName: string, propValue: any) => {
    return cy.window().its('ng').invoke('getComponent', selector).then(component => {
      component[propName] = propValue;
      return component;
    });
});


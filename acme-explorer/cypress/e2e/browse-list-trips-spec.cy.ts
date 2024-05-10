describe('trips list and display', () => {


  it('should display trips as cards', () => {

    cy.visit('http://localhost:4200');
    cy.wait(2000);

    cy.get('body app-root div div div app-trip-list div:nth-child(2)').should('exist');
    
  });

  it('should display a message when no trips are available', () => {
    cy.intercept('GET', 'http://localhost:4200', { 
        statusCode: 200, 
        body: [] 
    }).as('getTrips');

    cy.request('http://localhost:4200').then((response) => {
        expect(response.headers['content-type']).to.include('text/html');
        if (response.body.length === 0) {
            cy.contains('Sorry, no trips found').should('be.visible');
        }
    });
  });

  it('should filter trips by search keyword', () => {
    cy.visit('http://localhost:4200');
    cy.wait(2000);
    const keyword = 'Toledo'; // Palabra clave para la búsqueda

    cy.get('body app-root div div div app-trip-list button.btn.btn-primary.me-2').click();
    cy.wait(1000);
 
    cy.get('#searchValue').type(keyword);

    cy.get('#navbarSupportedContent > div > form > button').click();

    cy.wait(3000); 

    cy.get('body app-root div div div app-trip-table div ngx-datatable div datatable-body datatable-selection datatable-scroller datatable-row-wrapper datatable-body-row div.datatable-row-center.datatable-row-group.ng-star-inserted datatable-body-cell:nth-child(3) div strong').contains(keyword).should('exist');


  
  
  });

  it('should display trip information', () => {

    cy.visit('http://localhost:4200/trips/UicwIckeJm34T1Uuqm2V');
    cy.wait(2000);

    cy.get('body > app-root > div > div > div > app-trip-display > div > div:nth-child(1) > h5:nth-child(1)').should('contain', 'Toledo');

    cy.get('body > app-root > div > div > div > app-trip-display > div > div:nth-child(1) > h5.card-title.text-center.contador').should('be.visible');

    cy.get('body > app-root > div > div > div > app-trip-display > div > div:nth-child(1) > h5:nth-child(3)').should('contain', '240423-RVRA');

    cy.get('body > app-root > div > div > div > app-trip-display > div > div:nth-child(1) > p').should('contain', 'Escapada a la preciosa ciudad de Toledo');

    cy.get('body > app-root > div > div > div > app-trip-display > div > div:nth-child(2) > div:nth-child(1) > p').invoke('text').should('match', /Price:\s*300EUR/);

    cy.get('body > app-root > div > div > div > app-trip-display > div > div.card-body.mb-2.text-center > div.row.justify-content-center > div:nth-child(1) > p').should('contain', 'Start Date:');
    cy.get('body > app-root > div > div > div > app-trip-display > div > div.card-body.mb-2.text-center > div.row.justify-content-center > div:nth-child(2) > p').should('contain', 'End Date:');

    cy.get('body > app-root > div > div > div > app-trip-display > div > ul > li > h6').should('contain', 'Requirements:');
    cy.get('body > app-root > div > div > div > app-trip-display > div > ul > li > ul > li:nth-child(1) > p').should('contain', 'Llevar camisa');
    cy.get('body > app-root > div > div > div > app-trip-display > div > ul > li > ul > li:nth-child(2) > p').should('contain', 'Llevar sombrero');

  });


  it('should display trip stages', () => {

    cy.visit('http://localhost:4200/trips/UicwIckeJm34T1Uuqm2V');
    cy.wait(2000);

    cy.get('body > app-root > div > div > div > app-trip-display > div > div:nth-child(5) > button.btn.btn-warning.ml-2').click();

    cy.get('body > app-root > div > div > div > app-stage > div:nth-child(1) > ngx-datatable > div > datatable-body > datatable-selection > datatable-scroller > datatable-row-wrapper:nth-child(1) > datatable-body-row > div.datatable-row-center.datatable-row-group.ng-star-inserted > datatable-body-cell:nth-child(1) > div').should('contain', ' Visita al castillo ');
    cy.get('body > app-root > div > div > div > app-stage > div:nth-child(1) > ngx-datatable > div > datatable-body > datatable-selection > datatable-scroller > datatable-row-wrapper:nth-child(1) > datatable-body-row > div.datatable-row-center.datatable-row-group.ng-star-inserted > datatable-body-cell:nth-child(2) > div').should('contain', ' Visita guiada al castillo del rey ');
    cy.get('body > app-root > div > div > div > app-stage > div:nth-child(1) > ngx-datatable > div > datatable-body > datatable-selection > datatable-scroller > datatable-row-wrapper:nth-child(1) > datatable-body-row > div.datatable-row-center.datatable-row-group.ng-star-inserted > datatable-body-cell:nth-child(3) > div').should('contain', ' 200 ');

    cy.get('body > app-root > div > div > div > app-stage > div:nth-child(1) > ngx-datatable > div > datatable-body > datatable-selection > datatable-scroller > datatable-row-wrapper:nth-child(2) > datatable-body-row > div.datatable-row-center.datatable-row-group.ng-star-inserted > datatable-body-cell:nth-child(1) > div').should('contain', ' Visita al museo ');
    cy.get('body > app-root > div > div > div > app-stage > div:nth-child(1) > ngx-datatable > div > datatable-body > datatable-selection > datatable-scroller > datatable-row-wrapper:nth-child(2) > datatable-body-row > div.datatable-row-center.datatable-row-group.ng-star-inserted > datatable-body-cell:nth-child(2) > div').should('contain', ' Visita al museo de historia ');
    cy.get('body > app-root > div > div > div > app-stage > div:nth-child(1) > ngx-datatable > div > datatable-body > datatable-selection > datatable-scroller > datatable-row-wrapper:nth-child(2) > datatable-body-row > div.datatable-row-center.datatable-row-group.ng-star-inserted > datatable-body-cell:nth-child(3) > div').should('contain', ' 100 ');
    


  });

    
});

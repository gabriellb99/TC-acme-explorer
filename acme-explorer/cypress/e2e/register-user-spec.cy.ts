describe('User Registration Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/register');
    cy.wait(2000);
    //cy.getAppComponentAndSetValue('app-root > div > div > div > app-register', 'actorId', null);

  });

  it('should display registration form', () => {
    cy.get('form').should('exist');
  });

  it('should disable Sign In button when required fields are not filled', () => {
    cy.get('button[type="submit"]').should('be.disabled');

  });

  it('should enable Sign In button when all required fields are filled', () => {
    cy.get('#name').type('John');
    cy.get('#surname').type('Doe');
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type('password123');

    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should disable Sign In button when phone not has only numbers', () => {
    cy.get('#name').type('John');
    cy.get('#surname').type('Doe');
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type('password123');
    cy.get('#phone').type('123abc');

    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('should enable Sign In button when phone has only numbers', () => {
      
    cy.get('#name').type('John');
    cy.get('#surname').type('Doe');
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type('password123');
    cy.get('#phone').type('123456789');

    cy.get('button[type="submit"]').should('not.be.disabled');
  });

  it('should display validation message for password shorter than 6 characters', () => {
    const shortPassword = '12345'; 
    cy.get('#name').type('John');
    cy.get('#surname').type('Doe');
    cy.get('#phone').type('123456789');
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type(shortPassword);
    cy.get('button[type="submit"]').should('not.be.disabled');
    cy.get('button.btn.btn-warning.btn-block[type="submit"]').click();
    cy.get('#password-error').should('be.visible').and('contain', 'Password must be at least 6 characters long.');
  });
/*
  it('should redirect to trips page after successful form submission', () => {
    cy.intercept('POST', 'https://identitytoolkit.googleapis.com/v1/accounts:signUp**', (req): any => {
      req.reply({
        statusCode: 200,
        body: {}
      });
    }).as('firebaseCall');
    
    cy.get('#name').type('John');
    cy.get('#surname').type('Doe');
    cy.get('#phone').type('123456789');
    cy.get('#email').type('john.doe@example.com');
    cy.get('#password').type('password123');
    cy.get('button.btn.btn-warning.btn-block[type="submit"]').click();
    
    cy.wait('@firebaseCall')
    cy.url().should('eq', 'http://localhost:4200/trips');

  });*/
});

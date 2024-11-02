describe('Navigation', () => {

    beforeEach(() => {
        cy.visit('/')
    })

    it('should load the main page', () => {
        cy.get('nav').should('exist');
        cy.get('section').contains('Happy Mind Mental Health').should('exist');
        cy.get('section').contains('What mental illnesses are found?').should('exist');
        cy.get('section').contains('How to take care of your mental health').should('exist');
        cy.get('footer').should('exist');
      });

      it('navbar and navigate',()=>{
        cy.get('nav').should('exist');
        cy.get('nav').find('a').should('exist');
        cy.get('a[href*="login"]').first().click({force:true});
        cy.url().should('include', '/login');
      })

      it('details Hero section', () => {
        cy.get('h1').contains('Happy Mind Mental Health').should('exist');
        cy.get('img[src="images/slide/MH6.png"]').should('exist');
      })

      it('details mental section', () => {
        cy.get('h2').contains('What mental illnesses are found?').should('be.visible');
        cy.get('img[src="/images/slide/MH4.jpg"]').should('exist');
        cy.get('.flex.mb-12').should('have.length', 4);

      })

      


      
    
      
  })
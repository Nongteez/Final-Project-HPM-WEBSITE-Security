describe('Graph Component', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/homepage');
    });
  
    it('renders the component', () => {
      cy.get('.bg-SLB').should('exist');
    });
  
    it('displays two chart containers', () => {
      cy.get('.bg-white.rounded-lg').should('be.visible');
      cy.get('.bg-white.rounded-lg').should('have.length', 2);
    });
  
    it('renders PieChart', () => {
      cy.get('#Pie').should('be.visible');
      cy.get('#Pie').find('svg').should('exist');
    });
  
    it('renders BarChart', () => {
      cy.get('#Bar').should('be.visible');
      cy.get('#Bar').find('svg').should('exist');
    });
  });
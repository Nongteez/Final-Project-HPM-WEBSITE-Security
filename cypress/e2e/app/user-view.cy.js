
describe('User View', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/homepage')
      })

    it('header renders', () => {
        cy.get('.flex.flex-col.h-[300px]').should('be.visible');
        cy.get('.flex.justify-between.w-full').should('contain', 'ผู้ใช้งาน')
    })

    it('users list thumbnail', ()=>{
        cy.get('.flex.flex-warp').should('have.length',4);
    })

    if('user navigation',()=>{
        cy.get('.btn.border-2.border-neutral-300.w-full').first().click()
        cy.url().should('include', '/resultuser/')
    });


})
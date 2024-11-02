

describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login'); 
    });
  
    it('displays the login form', () => {
      cy.get('h3').should('contain', 'เข้าสู่ระบบ');
      cy.get('input[type="email"]').should('exist');
      cy.get('input[type="password"]').should('exist');
      cy.get('button[type="submit"]').contains('เข้าสู่ระบบ');
      cy.wait(1000)
    });
  
    it('shows error toast when submitting empty form', () => {
      cy.get('button[type="submit"]').click();
      cy.get('.Toastify').contains('กรุณากรอกข้อมูลให้ครบ').should('exist');
      cy.wait(1000)
    });
  
    it('shows error toast when submitting invalid email', () => {
      cy.get('input[type="email"]').type('invalid@example.com');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      cy.get('.Toastify').contains('อีเมลไม่ถูกต้อง').should('exist');
      cy.wait(1000)
    });


    it('shows error toast when submitting invalid password', () => {
        cy.get('input[type="email"]').type('admin@gmail.com');
        cy.get('input[type="password"]').type('wrongpassword');
        cy.get('button[type="submit"]').click();
        cy.get('.Toastify').contains('รหัสผ่านไม่ถูกต้อง').should('exist');
        cy.wait(1000)
      });

    it('successfully logs in with valid user', () => {
      cy.get('input[type="email"]').type('admin@gmail.com');
      cy.get('input[type="password"]').type('happymindadmin');
      cy.get('button[type="submit"]').click();
      cy.get('.Toastify').contains('เข้าสู่ระบบสําเร็จ').should('exist');
      cy.url().should('include', '/homepage');
      cy.wait(1000)
    });
  
  
    it('navigates to forget password page', () => {
      cy.get('a[href*="forget-password"]').click();
      cy.url().should('include', '/forget-password');
      cy.wait(1000)
    });

  
    it('navigates back to main page', () => {
      cy.contains('กลับหน้าหลัก').click();
      cy.url().should('eq',  'http://localhost:3000/');

    });
  
    
  });
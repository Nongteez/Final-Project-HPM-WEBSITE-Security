describe("test api /api/quiz", () => {
    it('get quiz data', () => {
        cy.request({
            method: "GET",
            url: "/api/quiz"
        }).then((response) => {
            console.log(response.body)
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('array')
            expect(response.body).length.to.be.greaterThan(1)
        })
        cy.wait(1000);
    })



})
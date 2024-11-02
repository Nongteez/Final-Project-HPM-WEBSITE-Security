describe('test api /api/fighting', () => {
    let id
    it('get fighting data', () => {
        cy.request({
            method: "GET",
            url: "/api/fighting"
        }).then((response) => {
            console.log(response.body)
            expect(response.status).to.eq(200)
            expect(response.body).to.be.an('object')
        })
        cy.wait(1000);
    })
    it('post fighting data', () => {
        cy.request({
            method: "POST",
            url: "/api/fighting",
            body: {
                title: "test",
                text: "test",
                image: "test",
                create_by: 1
            }}).then((response) => {
                console.log(response.body)
                id = response.body.id
                expect(response.status).to.eq(201)
            })
        cy.wait(1000);
    })
    it('put fighting data', () => {
        cy.request({
            method: "PUT",
            url: "/api/fighting/" + id,
            body: {
                title: "test",
                text: "test",
                image: "test",
                create_by: 1
            }}).then((response) => {
                console.log(response.body)
                expect(response.status).to.eq(200)
            })
        cy.wait(1000);
    })
    it('delete fighting data', () => {
        cy.request({
            method: "DELETE",
            url: "/api/fighting/" + id,
        }).then((response) => {
            console.log(response.body)
            expect(response.status).to.eq(200)
        })
        cy.wait(1000);
    })
})
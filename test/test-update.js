/* globals before */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const database = require("./setup-db.js");

let result = null;

chai.should();

chai.use(chaiHttp);

describe('Documents', () => {
    before('connect', async function() {
        await database.befores();
        result = await database.createNew();
    });

    describe('PUT /update/:id', () => {
        it('Should update a document', (done) => {
            let updateDoc = {
                name: "Test uppdatera"
            };

            chai.request(server)
                .put(`/update/${result.id}`)
                .send(updateDoc)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.text.should.be.a("string");
                    result.data.name.should.not.equal(updateDoc.name);
                    done();
                });
        });
    });
});

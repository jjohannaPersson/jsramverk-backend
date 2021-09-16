/* globals before */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const database = require("./setup-db.js");

chai.should();

chai.use(chaiHttp);

describe('Documents', () => {
    before('connect', async function() {
        await database.befores();
    });

    describe('POST /create', () => {
        it('Should create a new document', (done) => {
            let createDoc = {
                name: "Test ny",
                html: "Test ny html"
            };

            chai.request(server)
                .post(`/create`)
                .send(createDoc)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.text.should.be.a("string");
                    done();
                });
        });
    });
});

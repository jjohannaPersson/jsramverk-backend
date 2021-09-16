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

    describe('GET /', () => {
        it('Should get all documents', (done) => {
            chai.request(server)
                .get("/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("array");

                    done();
                });
        });
    });
});

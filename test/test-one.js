/* globals before */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const database = require("./setup-db.js");

chai.should();

chai.use(chaiHttp);

let result = null;

describe('Documents', () => {
    before('connect', async function() {
        await database.befores();
        result = await database.createNew();
    });

    describe('GET /update/:id', () => {
        it('Should get one document', (done) => {
            chai.request(server)
                .get(`/update/${result.id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.name.should.equal(`${result.data.name}`);
                    done();
                });
        });
    });
});

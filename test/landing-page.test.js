const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');

chai.use(chaiHttp);

describe('API END POINT LANDING PAGE TESTING', () => {
   it('Should return 200 status and have an object response', (done) => {
        chai.request(app).get('/api/v1/landing-page').end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            done();
        });
   });

   it('Should return response body with hero object correctly', (done) => {
        chai.request(app).get('/api/v1/landing-page').end((err, res) => {
            expect(res.body).to.have.property('hero');
            expect(res.body.hero).to.have.all.keys('travelers', 'treasures', 'cities');
            done();
        });
   });

   it('Should return response body with mostPicked array correctly', (done) => {
        chai.request(app).get('/api/v1/landing-page').end((err, res) => {
            expect(res.body).to.have.property('mostPicked');
            expect(res.body.mostPicked).to.have.an('array');
            done();
        });
    });

    it('Should return response body with category array correctly', (done) => {
        chai.request(app).get('/api/v1/landing-page').end((err, res) => {
            expect(res.body).to.have.property('category');
            expect(res.body.category).to.have.an('array');
            done();
        });
    });

    it('Should return response body with testimonial object correctly', (done) => {
        chai.request(app).get('/api/v1/landing-page').end((err, res) => {
            expect(res.body).to.have.property('testimonial');
            expect(res.body.testimonial).to.have.an('object');
            done();
        });
    });
})
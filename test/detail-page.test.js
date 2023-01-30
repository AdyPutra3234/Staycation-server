const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');
const mongoose = require('mongoose');
const Item = require('../models/item');


chai.use(chaiHttp);

describe('API END POINT DETAIL PAGE TESTING', () => {
    let itemId = '';

    const dataTesting = {
        title: 'Green Hotel',
        price: 15,
        sumBooking: 3,
        country: 'Indonesia',
        city: 'Bandung',
        isPopular: false,
        description: 'Minimal techno is a minimalist subgenre of techno music. It is characterized by a stripped-down aesthetic that exploits the use of repetition and understated development. Minimal techno is thought to have been originally developed in the early 1990s by Detroit-based producers Robert Hood and Daniel Bell.',
        unit: 'night',
        imageId: [
            // done
            { _id: mongoose.Types.ObjectId('5e96cbe292b97300fc90cd13') },
            // done
            { _id: mongoose.Types.ObjectId('5e96cbe292b97300fc90cd14') },
            // done
            { _id: mongoose.Types.ObjectId('5e96cbe292b97300fc90cd15') }
        ],
        featureId: [
        ],
        activityId: [
            { _id: mongoose.Types.ObjectId('5e96cbe292b97300fc90bb01') },
            { _id: mongoose.Types.ObjectId('5e96cbe292b97300fc90bb02') },
            { _id: mongoose.Types.ObjectId('5e96cbe292b97300fc90bb03') },
            { _id: mongoose.Types.ObjectId('5e96cbe292b97300fc90bb04') }
        ],
        categoryId: mongoose.Types.ObjectId('5e96cbe292b97300fc901112')
    }

    before('create new data tetsing', async () => {

        const item = await Item.create(dataTesting);
        itemId = item._id;
        
    });

    after('cleanup', async () => {
        const item = await Item.findOne({ _id: itemId })
        item.remove();
    })  

    it('should return 200 status and have an object response', (done) => {
        chai.request(app).get(`/api/v1/detail-page/${itemId}`).end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            done();
        });
    });

    it('Should return response body correctly', (done) => {
        chai.request(app).get(`/api/v1/detail-page/${itemId}`).end((err, res) => {
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('title');
            expect(res.body.title).to.equal(dataTesting.title);
            expect(res.body).to.have.property('price');
            expect(res.body.price).to.equal(dataTesting.price);
            expect(res.body).to.have.property('country');
            expect(res.body.country).to.equal(dataTesting.country);
            expect(res.body).to.have.property('city');
            expect(res.body.city).to.equal(dataTesting.city);
            expect(res.body).to.have.property('description');
            expect(res.body.description).to.equal(dataTesting.description);
            done();
        });
    })
})
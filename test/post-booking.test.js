const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../app');
const Item = require('../models/item');
const Booking = require('../models/booking');
const fs = require('fs');
const mongoose = require('mongoose');
const { before } = require('mocha');
const path = require('path');


chai.use(chaiHttp);

describe('API END POINT POST BOOKING TESTING', () => {
    let itemId = '';
    let bookingId = '';

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
            { _id: mongoose.Types.ObjectId('5e96cbe292b97300fc90cd13') },
    
            { _id: mongoose.Types.ObjectId('5e96cbe292b97300fc90cd14') },

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

    before('create data testing', async () => {
        const item = await Item.create(dataTesting);
        itemId = item._id.toHexString();
    });

    after('cleanUp', async () => {
        const booking = await Booking.findOne({ _id: bookingId });
        const item = await Item.findOne({ _id: itemId });

        fs.unlinkSync(path.join(`public/${booking.payments.proofOfPayment}`));

        booking.remove();
        item.remove();
    })

    it('Should return status 201 and have an object response', (done) => {
        const image = __dirname + '/proofOfPayment.jpeg';
        const form = {
            image,
            itemId,
            duration: 2,
            bookingStartDate: '2023-01-01T08:00:00',
            bookingEndDate: '2023-01-01T08:00:00',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@gmail.com',
            phoneNumber: '08150008989',
            accountHolder: 'John doe',
            bankFrom: 'BNI',
        };

        chai.request(app).post('/api/v1/booking-page')
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .field('itemId', form.itemId)
            .field('duration', form.duration)
            .field('bookingStartDate', form.bookingStartDate)
            .field('bookingEndDate', form.bookingEndDate)
            .field('firstName', form.firstName)
            .field('lastName', form.lastName)
            .field('email', form.email)
            .field('phoneNumber', form.phoneNumber)
            .field('accountHolder', form.accountHolder)
            .field('bankFrom', form.bankFrom)
            .attach('image', fs.readFileSync(form.image), 'proofOfPayment.jpeg')
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(201)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('message')
                expect(res.body.message).to.equal('Success Booking')
                expect(res.body).to.have.property('booking')
                expect(res.body.booking).to.have.all.keys('payments', '_id', 'invoice', 'startDate', 'endDate', 'total', 'itemId', 'memberId', '__v')
                expect(res.body.booking.payments).to.have.all.keys('status', 'proofOfPayment', 'bankFrom', 'accountHolder')
                expect(res.body.booking.itemId).to.have.all.keys('_id', 'title', 'price', 'duration')
                bookingId = res.body.booking._id;
                done();
            });

    });
})
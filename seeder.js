const mongoose = require('mongoose');
const data = require('./data_seeder');

const activity = require('./models/activity');
const bank = require('./models/bank');
const booking = require('./models/booking');
const category = require('./models/category');
const feature = require('./models/feature');
const image = require('./models/image');
const item = require('./models/item');
const member = require('./models/member');
const users = require('./models/users');

const collections = [
  activity, bank, booking, category, feature, image, item, member, users
];

mongoose.connect('mongodb://localhost:27017/db-staycation')
  .then(() => {
    console.log('MONGODB Connecttion Open')

    collections.forEach(async (collection) => {
      await collection.deleteMany({});
      data.forEach(async (d) => {
        if (d.model === collection.modelName ) {
          d.documents.forEach(async (document) => {
            await collection.create(document);
          })
        }
      });
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

setTimeout( function () {
  mongoose.disconnect();
}, 1000);
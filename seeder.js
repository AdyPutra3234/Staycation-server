const mongoose = require('mongoose');
const data_seed = require('./data_seeder');

const activity = require('./models/activity');
const bank = require('./models/bank');
const booking = require('./models/booking');
const category = require('./models/category');
const feature = require('./models/feature');
const featureCategory = require('./models/feature_category');
const image = require('./models/image');
const item = require('./models/item');
const member = require('./models/member');
const users = require('./models/users');

require('dotenv').config();

const collections = [
  activity, bank, booking, category, featureCategory, feature, image, item, member, users
];

mongoose.connect(`${process.env.DATABASE_URL}`)
  .then( () => {
    console.log('database connecttion Open')

    collections.forEach(async (collection) => {
      await collection.deleteMany({});
      data_seed.forEach(async (data) => {
        if (data.model === collection.modelName ) {
          data.documents.forEach(async (document) => {
            await collection.create(document);
          })
        }
      });
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
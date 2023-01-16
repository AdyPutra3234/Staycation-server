const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

user.pre('save', async function (next) {
   try {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hash(this.password, salt);
        this.password = hashPassword;

        return next();
   } catch (error) {
        return next(error);
   }
})

module.exports = mongoose.model('users', user);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newuser = new Schema({
    uid: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    userName: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true}
},{timestamps: true});

const newUser = mongoose.model('newuser',newuser);

module.exports = {
    newUser
}
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    googleId: { type: String, default: null },
    facebookId: { type: String, default: null },
    profileImage: { type: String, default: null }
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = { UserModel };
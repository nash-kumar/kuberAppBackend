const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UserSchema = mongoose.Schema({
    loginType: String,
    firstname: String,
    lastname: String,
    email: { type: String, unique: true },
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    creditCard:Number,
    debitCard:Number
});

UserSchema.pre('save', function (next) {
     next();
});

module.exports = mongoose.model('User', UserSchema);
const User = mongoose.model('user', UserSchema);
module.exports = User;

const Users = mongoose.model('user', UserSchema);
// UserSchema.plugin(AutoIncrement, { inc_field: 'id' });
module.exports = {
    userModel: Users,
    UserSchema: UserSchema
}
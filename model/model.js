const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UserSchema = mongoose.Schema({
            firstname: String,
            lastname: String,
            email: { type: String, unique: false},
            password: String,
            resetPasswordToken: String,
            resetPasswordExpires: Date,
            TypeofLogin:String,
           
});

UserSchema.pre('save', function (next) {
     next();
});

module.exports = mongoose.model('User', UserSchema);

const Users = mongoose.model('user', UserSchema);
// UserSchema.plugin(AutoIncrement, { inc_field: 'id' });
module.exports = {
    userModel: Users,
    UserSchema: UserSchema
}
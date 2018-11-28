let mongoose = require('mongoose');
let userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    resetPasswordToken:String,
    resetPasswordExpires:Date
});

module.exports = mongoose.model('User', userSchema);
let Users = mongoose.model('user', userSchema);
module.exports = {
        userModel: Users,
        userSchema: userSchema
    }
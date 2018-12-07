const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    type: {type: String, enum: ["native", "google", "facebook"], required: true},
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },    
    userId: { type: String, default: null },
    profileImage: { type: String, default: null },
    recentlyViewedCharity: [{ type: Schema.Types.ObjectId, refer: 'users'}]//refer - collection Name
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = { UserModel };
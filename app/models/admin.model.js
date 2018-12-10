const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AdminSchema = new Schema({
    type: { type: [String], enum: ["native", "google", "facebook"], required: true },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    userId: { type: String, default: null },
    profileImage: { type: String, default: null },
    role: { type: String, default: "admin" }
});

const AdminModel = mongoose.model('admins', AdminSchema);
module.exports = { AdminModel };
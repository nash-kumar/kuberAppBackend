const UserModel = require('../../models/user.model').UserModel;
const UserModelHelper = require('../../helpers/modelHelper');


function findUser(query, callback) {
    UserModelHelper.find(UserModel, { query, select: '-password -userId' }, (err, res) => {
        if (err) {
            console.log("User Model Error:", err);
            callback(err, null);
        } else if (res.length > 0) {
            console.log("User Model Result:", res);
            callback(null, res);
        } else callback(null, null);
    });
}

function findUserAndUpdate(query, data, callback) {
    UserModelHelper.update(UserModel, { query, update: data, options: { new: true, select: "-password" } }, (err, res) => {
        if (err) {
            console.log("User Model Error:", err);
            callback(err, null);
        } else if (res) {
            console.log("User Model Result:", res);
            callback(null, res);
        } else callback(null, null);
    });
}


module.exports = { signup, login, nearby, findUser, findUserAndUpdate }
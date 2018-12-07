const UserModel = require('../../models/user.model').UserModel;
const UserModelHrelper = require('../../helpers/modelHelper');
const sortByDistance = require('sort-by-distance');

function signup(data, callback) {
    UserModelHrelper.addRecord(UserModel, data, (err, res) => {
        if (err) {
            console.log("User Model Error:", err);
            callback(err, null);
        } else if (res) {
            let resp = JSON.parse(JSON.stringify(res));
            if (delete resp.password ) {
                console.log("User Model Result:", resp);
                callback(null, resp);
            } else callback(null, null);
        } else callback(null, null);
    });
}

function login(query, callback) {
    UserModelHrelper.find(UserModel, query, (err, res) => {
        if (err) {
            console.log("User Model Error:", err);
            callback(err, null);
        } else if (res) {
            callback(null, res[0]);
        } else callback(null, null);
    });
}
function nearby(query, callback) {
    UserModelHrelper.find(UserModel, query, (err, res) => {
        if (err) {
            console.log("User Model Error:", err);
            callback(err, null);
        } else if (res) {
            callback(null, res[0]);
        } else callback(null, null);
    });
}

function findUser(query, callback) {
    UserModelHrelper.find(UserModel, { query, select: '-password' }, (err, res) => {
        if (err) {
            console.log("User Model Error:", err);
            callback(err, null);
        } else if (res.length > 0) {
            console.log("User Model Result:", res);
            callback(null, res[0]);
        } else callback(null, null);
    });
}

function findUserAndUpdate(query, data, callback) {
    UserModelHrelper.update(UserModel, { query, update: data, options: { new: true, select: "-password" } }, (err, res) => {
        if (err) {
            console.log("User Model Error:", err);
            callback(err, null);
        } else if (res || callback) {
            console.log("User Model Result:", res);
            callback(null, res);
        } else callback(null, null);
    });
}


module.exports = { signup, login, nearby, findUser, findUserAndUpdate }
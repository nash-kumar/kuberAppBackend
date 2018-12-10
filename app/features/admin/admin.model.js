const AdminModel = require('../../models/admin.model').AdminModel;
const AdminModelHelper = require('../../helpers/modelHelper');

function signup(data, callback) {
    AdminModelHelper.addRecord(AdminModel, data, (err, res) => {
        if (err) {
            console.log("Admin Model Error:", err);
            callback(err, null);
        } else if (res) {
            let resp = JSON.parse(JSON.stringify(res));
            if (delete resp.password) {
                console.log("Admin Model Result:", resp);
                callback(null, resp);
            } else callback(null, null);
        } else callback(null, null);
    });
}

function login(query, callback) {
    AdminModelHelper.find(AdminModel, { query }, (err, res) => {
        if (err) {
            console.log("Admin Model Error:", err);
            callback(err, null);
        } else if (res.length > 0) {
            callback(null, res[0]);
        } else callback(null, null);
    });
}

function findUser(query, callback) {
    AdminModelHelper.find(AdminModel, { query, select: '-password -AdminId' }, (err, res) => {
        if (err) {
            console.log("Admin Model Error:", err);
            callback(err, null);
        } else if (res.length > 0) {
            console.log("Admin Model Result:", res);
            callback(null, res);
        } else callback(null, null);
    });
}

function findUserAndUpdate(query, data, callback) {
    AdminModelHelper.update(AdminModel, { query, update: data, options: { new: true, select: "-password" } }, (err, res) => {
        if (err) {
            console.log("Admin Model Error:", err);
            callback(err, null);
        } else if (res) {
            console.log("Admin Model Result:", res);
            callback(null, res);
        } else callback(null, null);
    });
}


module.exports = { signup, login, findUser, findUserAndUpdate }
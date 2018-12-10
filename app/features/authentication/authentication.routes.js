const express = require('express');
const router = express.Router();
const resp = require('../../helpers/responseHelpers');
const AuthCtrl = require('./authentication.controller');
const UserModel = require('../user/user.model')
module.exports = router;

//Registeration API

router.post('/signup', (req, res) => {
    if (req.body.userData && req.query.role === "admin" || req.query.role === "user" && req.body.userData.email) {
        AuthCtrl.signup(req.body.userData, req.query.role, (err, doc) => {
            if (req.query.role === "admin") role = "Admin";
            else role = "User";
            if (err) {
                if (err && err.name === "ValidationError") resp.errorResponse(res, err, 501, "Required Fields Are Missing");
                else if (err.name === "MongoError" && err.code === 11000) resp.errorResponse(res, err, 501, `Email Id Already Reigistred using ${req.body.userData.type}`)
                else resp.errorResponse(res, err, 502, `Error While Adding ${role} Data`);
            }
            else if (doc) resp.successPostResponse(res, doc, `${role} Registered Succesfully`);
            else resp.noRecordsFound(res, `Unable To Add ${role} Data`);
        });
    } else resp.missingBody(res, "Missing Body");
});

//Login API

router.post('/login', (req, res) => {
    if (req.body.userData && req.query.role === "admin" || req.query.role === "user" && req.body.userData.email) {
        AuthCtrl.login(req.body.userData, req.query.role, (err, docs) => {
            if (err) resp.errorResponse(res, err, 501, 'Error Whle SignIn');
            else if (docs) resp.successGetResponse(res, docs, "Authenticated");
            else resp.noRecordsFound(res, 'Invalid Id/Password')
        })
    } else resp.missingBody(res, "Missing Body");
})

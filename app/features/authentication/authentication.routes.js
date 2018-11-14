const express = require('express');
const router = express.Router();
const resp = require('../../helpers/responseHelpers');
const AuthCtrl = require('./authentication.controller');
module.exports = router;

router.post('/signup', (req, res) => {
    if (req.body.userData) {
        AuthCtrl.signup(req.body.userData, (err, doc) => {
            if (err) {
                if (err && err.name === "ValidationError") resp.errorResponse(res, err, 501, "Required Fields Are Missing");
                else if (err.name === "MongoError") resp.errorResponse(res, err, 501, "Email Id Already Reigistred")
                else resp.errorResponse(res, err, 502, "Error While Adding User Data");
            }
            else if (doc) resp.successPostResponse(res, doc, "User Registered Succesfully");
            else resp.noRecordsFound(res, "Unable To Add The User");
        });
    } else resp.missingBody(res, "Missing Body ");
});

router.get('/login', (req, res) => {
    if (req.headers.authorization) {
        headers = req.get('authorization');
        headers = headers.split(' ');
        AuthCtrl.login(headers[1], (err, docs) => {
            if (err) resp.err(res, err, 501, "Error While Signin");
            else if (docs) resp.successGetResponse(res, docs, "Autheticated");
            else resp.noRecordsFound(res, "Invalid EmailId/Password");
        });
    } else resp.missingBody(res, "Missing Body");
});




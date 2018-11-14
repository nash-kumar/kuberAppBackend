const express = require('express');
const router = express.Router();
const resp = require('../../helpers/responseHelpers');
const AuthCtrl = require('./authentication.controller');
module.exports = router;

router.post('/signup', (req, res) => {
    if (req.user) resp.successPostResponse(res, req.user, "User Registred With Google Succesfully");
    else resp.missingBody(res, "Missing Body");
});

router.post('/signin', (req, res) => {
    if (req.user) {
        AuthCtrl.socialSignin(req.user, (err, docs) => {
            if (err) resp.errorResponse(res, err, 501, "Error While Signin");
            else if(docs) resp.successPostResponse(res, docs, "Authenticated");
            else resp.noRecordsFound(res, "No User Found");
        });
    } else {
        resp.missingBody(res, "Missing Body");
    }
});
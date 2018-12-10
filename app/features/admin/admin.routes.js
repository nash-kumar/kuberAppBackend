const express = require('express');
const router = express.Router();
const resp = require('../../helpers/responseHelpers');
const AdminCtrl = require('../user/user.controller');
const CharityModel = require('../charity/charity.controller');
module.exports = router;

router.get('/profile', (req, res) => {
    if (req.user) resp.successGetResponse(res, req.user, "User Profile Details:");
    else resp.unauthorized(res, "Unauthorized");
});

// router.post('/addCharity', (req, res) => {
//     if (req.body.charityData) {
//         CharityModel.addNewCharity(req.body.charityData, (err, doc) => {
//             if (err) resp.errorResponse(res, err, 501, 'Required Fields are missing!');
//             else if (doc) resp.successPostResponse(res, doc, 'Registered Successfully!');
//             else resp.missingBody(res, 'Missing body');
//         })
//     }else resp.errorResponse(res, err, 501, 'Error While Adding Charity!');
// })
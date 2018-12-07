const express = require('express');
const router = express.Router();
const resp = require('../../helpers/responseHelpers');
const UserModel = require('../../models/user.model').UserModel;
const model = require('../user/user.controller');
const helper = require('../../helpers/modelHelper');

module.exports = router;

router.get('/profile', (req, res) => {
    if (req.user) resp.successGetResponse(res, req.user, "User Profile Details:");
    else resp.unauthorized(res, "Unauthorized");
});

// router.get('/', (req, res)=>{
//     UserModel.find({}, 'firstName', (err, res)=>{
//         if(res) resp.successGetResponse(res, data, "User Profile Details:");
//         else resp.errorResponse(res, err, 502, "Error While Adding User Data");
//     })
// })
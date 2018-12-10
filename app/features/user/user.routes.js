const express = require('express');
const router = express.Router();
const resp = require('../../helpers/responseHelpers');
const UserCtrl = require('../user/user.controller');
const helper = require('../../helpers/modelHelper');

module.exports = router;

router.get('/profile', (req, res) => {
    if (req.user) resp.successGetResponse(res, req.user, "User Profile Details:");
    else resp.unauthorized(res, "Unauthorized");
});


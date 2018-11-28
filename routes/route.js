let express = require('express');
let router = express.Router();
module.exports = router;
let Api=require('../controllers/controllers');
let API_SEARCH=require('../controllers/search');

router.post('/register/',Api.register);
router.post('/login',Api.login);
router.post('/forgot',Api.forgot_password);
router.get('/reset/:token',Api.reset_get);
router.post('/reset/:token',Api.reset_password);

router.get('/search',API_SEARCH.search);
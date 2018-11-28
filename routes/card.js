let express = require('express');
let router = express.Router();
module.exports = router;

let Api_Card=require('../controllers/card');

router.post('/card',Api_Card.card);
router.get('/card/:id',Api_Card.Card_Get);
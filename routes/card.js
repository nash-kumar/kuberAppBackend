let express = require('express');
let router = express.Router();
let Auth=require('../middleware/check-auth');
module.exports = router;

let Api_Card=require('../controllers/card');

router.post('/card',Auth,Api_Card.card);
router.get('/card/:id',Auth,Api_Card.Card_Get);
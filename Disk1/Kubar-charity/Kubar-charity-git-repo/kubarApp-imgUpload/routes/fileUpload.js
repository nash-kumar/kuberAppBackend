const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();


var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./Images");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname + '.jpeg');
    }
});


var upload = multer({
    storage: Storage
}).single('charityLogo');


router.get('/', (req, res, next) =>{

});


router.post("/", (req, res) => {
    upload(req, res, function(err) {
        console.log(req.file);
        if (err) {
            return res.end("Something went wrong!");
        }
        return res.end("File uploaded sucessfully!.");
    });
});

module.exports = router;



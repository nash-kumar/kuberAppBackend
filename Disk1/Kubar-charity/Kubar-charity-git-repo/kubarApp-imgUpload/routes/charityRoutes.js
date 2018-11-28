const    express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');

const Charity = require('../models/charityModel');


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
});


// Routes
router.get('/', (req, res, next) => {
    var pageOptions = {
        page: Math.ceil(0, req.param('page')),
        limit: req.query.limit || 30
    }
    Charity.find()
        .skip(pageOptions.page * pageOptions.limit)
        .limit(pageOptions.limit)
        .select(" charityName description _id rating charitylogo ")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                charity: docs.map(doc => {
                    return {
                        _id: doc._id,
                        charityName: doc.charityName,
                        rating: doc.rating,
                        description: doc.description,
                        charitylogo: doc.charitylogo,
                        return: {
                            type: 'GET'
                        }
                    }
                })
            }
            res.status(200).json({
                message: 'Get method success',
                response
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
});


router.post('/',upload.single('charitylogo') ,(req, res) => {
    console.log(req.file);
    console.log('POST');
    const charity = new Charity({
        _id: new mongoose.Types.ObjectId(),
        charityName: req.body.charityName,
        description: req.body.description,
        rating: req.body.rating,
        charitylogo: req.file.path
    });
    charity
        .save()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Charity Details uploded',
                createdCharity: {
                    _id: result._id,
                    charityName: result.charityName,
                    description: result.description,
                    rating: result.rating,
                    request: {
                        type: 'POST',
                        url: "http://localhost:3200/charities/" + result._id
                        
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get("/:id", (req, res, next) => {
    const id = req.params.id;
    Charity.findById(id)
      .select('charityName rating description charitylogo')
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
              charity: doc,
              request: {
                  type: 'GET by Id',
              }
          });
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });

router.patch('/:id');

module.exports = router;
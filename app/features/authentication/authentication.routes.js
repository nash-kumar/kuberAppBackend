const express = require('express');
const router = express.Router();
const resp = require('../../helpers/responseHelpers');
const AuthCtrl = require('./authentication.controller');
const UserModel = require('../user/user.model')
module.exports = router;

//Registeration API

router.post('/signup', (req, res) => {
    if (req.body.userData && req.body.userData.email) {
        AuthCtrl.signup(req.body.userData, (err, doc) => {
            if (err) {
                if (err && err.name === "ValidationError") resp.errorResponse(res, err, 501, "Required Fields Are Missing");
                else if (err.name === "MongoError") resp.errorResponse(res, err, 501, "Email Id Already Reigistred")
                else resp.errorResponse(res, err, 502, "Error While Adding User Data");
            }
            else if (doc) resp.successPostResponse(res, doc, "User Registered Succesfully");
            else resp.alreadyRegistered(res, "Email Id Already Registered");
        });
    } else resp.missingBody(res, "Missing Body ");
});

//Login API

router.post('/login', (req, res) => {
if(req.body.userData)
    AuthCtrl.login(req.body.userData, (err, docs) => {
        if (err) resp.errorResponse(res, err, 501, 'Error Whle SignIn');
        else if (docs) resp.successGetResponse(res, docs, "Authenticated");
        else resp.noRecordsFound(res, 'Invalid Id/Password')
    })
})

// router.post('/login', (req, res) => {
//     const type = req.body.userData.type;
//     UserModel.findUser({email: req.body.userData.email}, (err, res)=>{
//         if(res){
//             AuthCtrl.login(type, (err, docs)=>{
//                 if (err) resp.errorResponse(res, err, 501, 'Error Whle SignIn');
//                 else if(docs) resp.successGetResponse(res, docs, "Authenticated");
//                 else resp.noRecordsFound(res, 'Invalid Id/Password')
//             })
//         }else resp.noRecordsFound(res, 'No data');
//     })
// })



// router.get('/login', (req, res) => {
// if (req.headers.authorization && req.query.type) {
//         headers = req.get('authorization');
//         headers = headers.split(' ');
//         AuthCtrl.login(req.query.type, headers[1], (err, docs) => {
//             if (err) resp.errorResponse(res, err, 501, "Error While Signin");
//             else if (docs) resp.successGetResponse(res, docs, "Autheticated");
//             else resp.noRecordsFound(res, "Invalid EmailId/Password");
//         });
//     } else resp.missingBody(res, "Missing Body");
// });

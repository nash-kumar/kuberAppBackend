// const CharityModel = require('../../models/charity.model').CharityModel;
// const CharityModelHelper = require('../../helpers/modelHelper');

// function addCharity(data, callback){
//     CharityModelHelper.addRecord(CharityModel, data, (err, res) => {
//         if(err){
//             callback(err, null);
//         }else if(res){
//             callback(null, res);
//         }else callback(null, null);
//     } )
// }


// function findCharity(query, callback) {
//     CharityModelHelper.find(CharityModel, { query, select: '-password -userId' }, (err, res) => {
//         if (err) {
//             console.log("User Model Error:", err);
//             callback(err, null);
//         } else if (res.length > 0) {
//             console.log("User Model Result:", res);
//             callback(null, res);
//         } else callback(null, null);
//     });
// }

// function findCharityAndUpdate(query, data, callback) {
//     CharityModelHelper.update(CharityModel, { query, update: data, options: { new: true, select: "-password" } }, (err, res) => {
//         if (err) {
//             console.log("User Model Error:", err);
//             callback(err, null);
//         } else if (res) {
//             console.log("User Model Result:", res);
//             callback(null, res);
//         } else callback(null, null);
//     });
// }

// function findCharityAndDelete(query, callback) {
//     CharityModelHelper.remove(CharityModel, { query }, (err, res) => {
//         if (err) {
//             console.log("Model Error:", err);
//             callback(err, null);
//         } else if (res.length > 0) {
//             callback(null, res)
//         } else callback(null, null);
//     })
// }


// module.exports = { addCharity, findCharity, findCharityAndUpdate, findCharityAndDelete }
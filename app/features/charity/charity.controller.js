// const CharityModel = require('../charity/charity.model');
// const ChartiyHelper = require('../../helpers/responseHelpers')

// function addNewCharity(data, callback) {
//     if (data) {
//         CharityModel.addCharity(data, (err, res) => {
//             if (err) {
//                 console.log("Admin Model Error:", err);
//                 callback(err, null);
//             } else if (res) {
//                 let resp = JSON.parse(JSON.stringify(res));
//                 if (delete resp.password) {
//                     console.log("Admin Model Result:", resp);
//                     callback(null, resp);
//                 } else callback(null, null);
//             } else callback(null, null);
//         });

//     }
// }

// module.exports = { addNewCharity }
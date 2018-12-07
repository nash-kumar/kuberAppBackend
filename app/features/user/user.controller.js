const UserModel = require('../user/user.model');


function near(data, callback){
    UserModel.nearby({}.select('name'), (err, res) => {
        if (err) {
            callback(err, null);
        } else {
            res.status(200).send({ success: true, message: 'Success!', result });
        }
    })
}

module.exports = { near }
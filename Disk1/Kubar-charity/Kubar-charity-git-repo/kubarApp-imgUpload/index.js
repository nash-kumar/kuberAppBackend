const express   = require('express');
const mongoose  = require('mongoose');
var bodyParser = require('body-parser')
const morgan = require('morgan');
require('dotenv').config();


const charityDetails = require('./routes/charityRoutes');
// Database connectio to the Mongooose 
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, function (err) {
    if (err) console.log('Error While connecting to DB:', err);
    else console.log("DB Connected Successfully");
});
mongoose.Promise = global.Promise;

// Init app
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/charities', charityDetails);


app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

const port = 3200;
app.listen(port, () => console.log(`server running at port ${port}`));
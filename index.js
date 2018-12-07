// const express = require('express');
// const app = express();
require('dotenv').config();
const app = require('express')(),
    cors = require('cors'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    mongoose = require('mongoose');
    colors = require('colours')

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, function (err) {
    if (err) console.log('Error While connecting to DB:'.red, err);
    else console.log("DB Connected Successfully".rainbow);
});

app.use(cors());
morgan.format('combined', '[:date[clf]] :- method :url HTTP/:http-version" :status :res[content-length] :response-time ms');
app.use(morgan('combined'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(passport.initialize());
app.use(passport.session());
// require('./app/config/passport')(passport);

const Auth = require('./app/features/authentication/authentication.routes');

const User = require('./app/features/user/user.routes');

app.use('/v1/authenticate', Auth);
app.use('/v1/user', User);
// passport.authenticate('jwt', { session: false }),

app.get('/', (req, res) => { res.send("welcome"); });
app.listen(3000, () => console.log('Server is running on port number 3000'));


const bodyParser = require('body-parser');
const express = require('express');
const logger = require('morgan');
const passport = require('passport');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));

require('./config/passport')(passport);
require('./server/routes/api')(app);

// Passport middlewear
app.use(passport.initialize());

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

module.exports = app;

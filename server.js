const bodyParser = require('body-parser');
const express = require('express');
const passport = require('passport');

const app = express();

app.get('/', (req, res) => res.send('Hello'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));

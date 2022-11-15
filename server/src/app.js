const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const router = require('./router');

const app = express();

app.use(express.json())
app.use(cors());
app.use(morgan('tiny'));

app.use(router);

module.exports = app;

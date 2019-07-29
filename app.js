var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
global.fetch = require('node-fetch');
var authUtils = require('./utils/auth');

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var userRouter = require('./routes/user');
var coupleRouter = require('./routes/couple');
var expenseRouter = require('./routes/expense');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/couple', coupleRouter);
app.use('/expense', authUtils.isTokenValid, expenseRouter);

module.exports = app;

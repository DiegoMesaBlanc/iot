const express = require('express');
const morgan = require('morgan');

const app = express();

/*Connecting to db*/
const ledRoutes = require('./app/led/ledRoutes')
/*importing routes*/


/*settings*/
app.set('port', process.env.PORT || 3000)

/*middlewares*/
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization, token");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE");
    next();
});


/*routes*/
app.use(ledRoutes);

module.exports = app;
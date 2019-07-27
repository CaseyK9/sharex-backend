var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var db = require('../models/index');

var poolData = {
    UserPoolId: 'us-east-1_rnZDON91V', // Your user pool id here
    ClientId: '5ak23h84ni4l3eh26627e7fhkq' // Your client id here
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

exports.userPool = userPool;

exports.isTokenValid = function (req, res, next) {
    var token = new AmazonCognitoIdentity.CognitoIdToken({ IdToken: req.headers.authorization });
    if (token.payload.exp) {
        if (new Date().getTime() / 1000 > token.payload.exp) {
            res.status(401).send({ message: 'Token has expired' });
        } else {
            db.User.findOrCreate({ 
                where: { email: token.payload.email },
                defaults: { email: token.payload.email }
            }).then(function ([user, created]) {
                req.user = user;
                next();
            })
        }
    } else {
        res.status(401).send({ message: 'Invalid Token' });
    }
}
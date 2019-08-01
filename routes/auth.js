var express = require('express');
var router = express.Router();
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
var userPool = require('../utils/auth').userPool;

router.post('/signin', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var authenticationData = {
        Username: email,
        Password: password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    var userData = {
        Username: email,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var responseJson = {
                token: result.getIdToken().getJwtToken(),
                refreshToken: result.getRefreshToken().getToken(),
                expiration: result.getIdToken().getExpiration()
            }
            res.json(responseJson);
        },
        onFailure: function (err) {
            res.status(401).json(err);
        }
    });
});

router.post('/refresh', function (req, res) {
    var token = new AmazonCognitoIdentity.CognitoIdToken({ IdToken: req.body.token });
    var email = token.payload.email;
    var refreshToken = req.body.refreshToken;
    var userData = {
        Username: email,
        Pool: userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    refreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({ RefreshToken: refreshToken })
    cognitoUser.refreshSession(refreshToken, function (err, session) {
        if (err) {
            res.status(401).json(err);
        } else {
            var responseJson = {
                token: session.getIdToken().getJwtToken(),
                refreshToken: session.getRefreshToken().getToken(),
                expiration: session.getIdToken().getExpiration()
            }
            res.json(responseJson);
        }
    })
});

module.exports = router;

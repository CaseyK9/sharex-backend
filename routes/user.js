var express = require('express');
var router = express.Router();
var authUtils = require('../utils/auth');

router.get('/', authUtils.isTokenValid, function (req, res) {
    res.json(req.user);
});

module.exports = router;
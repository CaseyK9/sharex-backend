var express = require('express');
var router = express.Router();
var authUtils = require('../utils/auth');
var db = require('../models/index');

router.get('/', authUtils.isTokenValid, function (req, res) {
    db.Couple.findByPk(req.user.coupleId, {
        include: [db.User]
    }).then(function (couple) {
        var result = {
            id: couple.id
        };
        var idx = couple.Users[0].email === req.user.email ? 0 : 1;
        result.you = couple.Users[idx];
        result.partner = couple.Users[1-idx];
        res.json(result);
    });
});

module.exports = router;
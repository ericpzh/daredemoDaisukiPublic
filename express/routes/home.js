var secrets = require('../config/secrets');
var mongoose = require('mongoose');

module.exports = function (router) {

    var homeRoute = router.route('/');

    homeRoute.get(function (req, res) {
        var connectionString = secrets.token;
        res.json({ message: 'Daredemo Daisuki' });
    });


    return router;
}

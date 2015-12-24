var jwt = require('jsonwebtoken');
var _ = require('lodash');
var bcrypt = require('bcrypt');

/**
 * AuthController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    login: function(req, res) {

        if (req.body.grant_type === 'password') {

            User.findByUsername(req.body.username).exec(function(err, user) {
                if (err) {
                    return res.badRequest({
                        error: err
                    });
                }
                if (!user || user.length < 1) {
                    return res.badRequest({
                        error: 'No such user'
                    });
                }

                bcrypt.compare(req.body.password, user[0].password, function(err, result) {
                    if (err || !result) {
                        return res.badRequest({
                            error: 'invalidPassword'
                        });
                    } else {
                        issueTokens(user, res);
                    }
                });
            });

        } else if (req.body.grant_type === 'refresh_token' && req.body.refresh_token) {

            var token, user;

            if (req.headers && req.headers.authorization) {
                var parts = req.headers.authorization.split(' ');
                if (parts.length == 2) {
                    var scheme = parts[0],
                        credentials = parts[1];

                    if (/^Bearer$/i.test(scheme)) {
                        token = credentials;
                    }
                } else {

                }
            }
            var bearerToken, refreshToken;

            bearerToken = jwt.verify(token, sails.config.jwt.secret);
            refreshToken = jwt.verify(req.body.refresh_token, sails.config.jwt.refresh_secret);

            if (_.isEqual(bearerToken, refreshToken)) {
                delete bearerToken.exp;
                delete bearerToken.iat;

                user = bearerToken;
                issueTokens(user, res);
            };
        }
    },

    logout: function(req, res) {
        req.logout();
        res.send({
            success: true,
            message: 'logoutSuccessful'
        });
    }
};

function issueTokens(user, res) {
    var expirationTimeInMinutes = sails.config.jwt.expiration_time_in_minutes;

    var token = jwt.sign(user, sails.config.jwt.secret, {
        expiresInMinutes: expirationTimeInMinutes
    });

    var refreshToken = jwt.sign(user, sails.config.jwt.refresh_secret, {
        expiresInMinutes: expirationTimeInMinutes
    });

    res.send({
        user: user[0],
        access_token: token,
        expires_in: expirationTimeInMinutes * 60, // because simple auth expects seconds
        refresh_token: refreshToken
    });
}

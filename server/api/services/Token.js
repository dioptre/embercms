var jwt = require('jsonwebtoken');
var secret = sails.config.jwt.secret
var refresh_secret = sails.config.jwt.refresh_secret;
var bcrypt = require('bcrypt');
var _ = require('lodash');

exports.getUser = function(token) {
	return new Promise(function (resolve, reject) {
		if (typeof token === 'undefined' || !token)
			return reject('not a valid token [0]');
		else {
			var parts = token.split(' ');
			if (parts.length == 2) {
			    var scheme = parts[0],
				credentials = parts[1];
			    if (/^Bearer$/i.test(scheme)) {
			
				jwt.verify(credentials, secret, function (err, result) {
					if (err)
						return reject(err);
					else
						return resolve(result);
				});
			    }
			    else {
				return reject('not a valid token [1]');
			    }
			} else {
				return reject('not a valid token [2]');
			}
		}
	});

};

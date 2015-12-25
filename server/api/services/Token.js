var jwt = require('jsonwebtoken');
var secret = sails.config.jwt.secret
var refresh_secret = sails.config.jwt.refresh_secret;
var bcrypt = require('bcrypt');
var _ = require('lodash');

exports.getUser = function(callback, token) {
//	console.log(token);
	if (typeof token === 'undefined' || !token)
		callback('not a valid token [0]');
	else {
		var parts = token.split(' ');
		if (parts.length == 2) {
		    var scheme = parts[0],
			credentials = parts[1];
		    if (/^Bearer$/i.test(scheme)) {
			
			jwt.verify(credentials, secret, function (err, result) {
				if (err)
					callback(err);
				else
					callback(null, result);
			});
		    }
		    else {
			callback('not a valid token [1]');
		    }
		} else {
			callback('not a valid token [2]');
		}
	}


};

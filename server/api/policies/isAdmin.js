//var Enumerable = require('linq');

module.exports = function isAdmin (req, res, next) {
	if (typeof req.headers === 'undefined' || !req.headers || typeof req.headers.authorization === 'undefined' || !req.headers.authorization)
		    return res.json(401, { error: 'Could not authenticate unknown user. (E_PRIVILEGE)'});
	var token = req.headers.authorization.split(' ');
	if (token.length !== 2)
	    return res.json(401, { error: 'Bad token (E_PRIVILEGE)'});

	Token.getUser(req.headers.authorization).then(
		function(user) {
			if (typeof user !== "undefined" && user && (user.length > 0 || user['0'])) {
				user = user[0] || user['0'];
				User.findOne({id: user.id}).populate('roles', {name: 'admin'}).exec(function(err,user){
					if(err) return res.json(417, { error: 'You are not permitted to perform this action. (E_PRIVILEGE)'});
					//console.log(user);
					if (typeof user.roles !== 'undefined' && user.roles && user.roles.length > 0) {
						res.cookie('isAdmin', true, { maxAge: 900000 });
						return next();
					}
					else  {
						return res.json(403, { error: 'Require privileges (E_PRIVILEGE)'});
					}
				});
			} else {
				return res.json(403, { error: 'Mismatched token (E_PRIVILEGE)'});		
			}
		}, 
		function (error) {
			return res.json(403, { error: 'User not found (E_PRIVILEGE)'});
		}
	).catch(function (err) {
		console.log(sails.debug("Auth Error: ", err));
	});
    
};

var Enumberable = require('linq');

module.exports = function (req, res, next) {
 	    if (typeof req.headers === 'undefined' || !req.headers || typeof req.headers.authorization === 'undefined' || !req.headers.authorization) 
		return res.status(401).json({ error: 'Could not authenticate unknown user '});
	    var token = req.headers.authorization.split(' ');
	    if (token.length !== 2)
		return res.status(401).json({ error: 'Could not authenticate unexpected token'});
		
	    Token.getUser(user).then(function(user) {
		var companyid = req.params.id;
		//If companyid exists, check ownwership and return
		if (typeof companyid !== 'undefined' && companyid) {


			Membership.findOne({company: companyid, user: user.id, position: 'admin'}).then(function (member) {
				var isAdmin = {id: null}; //id: { '!': null }} = true {{id : null}} = false				
				if (typeof member !== 'undefined' && member) {
					isAdmin = { id: { '!': null }};
				}
				Company.findOne({id: companyid}).where({ or: [{owner : user.id}, isAdmin] }).then(function (company) {
					if (typeof company === 'undefined' || !company || typeof company.id === 'undefined' || !company.id) {	
						return res.status(403).json({ error: 'Could not retrieve company or insufficient privileges for user '+ user.username });	
					}
					else {
						model.company = m.company; //Always keep original company
						next();
					}
				
				});
			});
		}
		else {
			//Try and find any company the person is member or owner
			//If there's more than one it's a bad request
			//Get the first
			//Or if none return true
			Membership.find({user: user.id, position: 'admin'}).then(function (member) {				
				Company.find({ limit : 2}).where({ or : [{owner : user.id}, {company : Enumerable.from(member).select("$.company").toArray()}]}).then(function (companies) {
					if (companies.length == 2) {
						return res.status(406).json({ error: 'Specific company required for the user '+ user.username });
					}
					else {
						next();
					}
				});
			});


		}		
	})
	.catch(function (err) {
		return res.status(403).json({ error: err });
	});
};


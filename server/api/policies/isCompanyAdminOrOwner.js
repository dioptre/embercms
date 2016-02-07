var Enumberable = require('linq');

module.exports = function (req, res, next) {
	if (typeof req.headers === 'undefined' || !req.headers || typeof req.headers.authorization === 'undefined' || !req.headers.authorization) 
		return res.status(401).json({ error: 'Could not authenticate unknown user '});
	var token = req.headers.authorization.split(' ');
	if (token.length !== 2)
		return res.status(401).json({ error: 'Could not authenticate unexpected token'});
	var model;
	if (typeof req.body !== 'undefined' && req.body)
		model = req.body[Object.keys(req.body)[0]];
	//Async method
	var checkCompany = function(companyid) {
		if (typeof companyid !== 'undefined' && companyid) {		
			Token.getUser(req.headers.authorization).then(function(user) {
				Membership.findOne({company: companyid, user: user.id, privileges: { contains: ["admin"]}}).then(function (member) {
					var isAdmin = {id: null}; //id: { '!': null }} = true {{id : null}} = false				
					if (typeof member !== 'undefined' && member) {
						isAdmin = { id: { '!': null }};
					}
					Company.findOne({id: companyid}).where({ or: [{owner : user.id}, isAdmin] }).then(function (company) {
						if (typeof company === 'undefined' || !company || typeof company.id === 'undefined' || !company.id) {	
							return res.status(403).json({ error: 'Could not retrieve company (' + companyid + ') or insufficient privileges for user '+ user.username });	
						}
						else {
							if (typeof model !== 'undefined' && model)
								model.company = companyid; //Always keep original company
							next();
						}

					});
				});
			})
			.catch(function (err) {
				return res.status(403).json({ error: (err || "Unkown auth error occurred.") });
			});
		}
		else {
			return res.status(406).json({ error: 'Company id required. '});
		}	
	};

	var companyid;
	if (typeof model === 'undefined' || !model) {
		var controller = req.options.controller || req.options.model;
		controller = controller.toLowerCase();		
		if (controller === 'company') {
			if (typeof req.params !== 'undefined' && req.params && typeof req.params.id === 'string')
				return checkCompany(req.params.id);
			else if (typeof req.query !== 'undefined' && req.query && typeof req.query.id === 'string')
				return checkCompany(req.query.id);
			else if (typeof req.body !== 'undefined' && req.body && typeof req.body.id === 'string')
				return checkCompany(req.body.id);
		}
		else {
			//console.log(req.params, controller)
			sails.models[controller].findOne(req.params.id || req.params.parentid).then(function (m) {
				if (typeof m !== 'undefined' && m && m.company !== 'undefined' && m.company) //Existing company
				{
					return checkCompany(m.company);
				}
				else {
					return res.status(404).json({ error: 'Company attribute not found.'});
				}
			});
		}
	}
	else {
		companyid = model.company;
		if (typeof companyid === 'undefined' || !companyid) 
			companyid = req.params.id;
		if (typeof companyid === 'undefined' || !companyid && typeof model !== 'undefined' && model) 
			companyid = model.id;
		if (typeof companyid === 'undefined' || !companyid && typeof req.body !== 'undefined' && req.body) 
			companyid = req.body.company;
		if (typeof companyid === 'undefined' || !companyid && typeof req.body !== 'undefined' && req.body) 
			companyid = req.body.id;
		return checkCompany(companyid);
	}

	
};


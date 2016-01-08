module.exports = function (req, res, next) {
 	    if (typeof req.headers === 'undefined' || !req.headers || typeof req.headers.authorization === 'undefined' || !req.headers.authorization) 
		return res.status(401).json({ error: 'Could not authenticate unknown user '});
	    var token = req.headers.authorization.split(' ');
	    if (token.length !== 2)
		return res.status(401).json({ error: 'Could not authenticate unexpected token'});
		
	    Token.getUser(user).then(function(user) {
		var model = req.body[Object.keys(req.body)[0]];
		var controller = req.options.controller || req.options.model;
		controller = controller.toLowerCase();
		var modelid;
		if (typeof model === 'undefined' || typeof model.id === 'undefined' || !model.id || model.id.length < 1) {
			modelid = req.params.id;
		}
		else {
			mid = m.id;
		}
		sails.models[controller].findOne(modelid).then(function (m) {
			if (typeof m !== 'undefined' && m && m.company !== 'undefined' && m.company) //Existing company
			{
				//...first check whether we are a company admin
				//TODO: Add multiple company support
				Company.findOne({id: m.company, createdBy : user.id}).then(function (company) {
					if (typeof company === 'undefined' || !company || typeof company.id === 'undefined' || !company.id) {	
						return res.status(403).json({ error: 'Company mismatch for user '+ user.username });
					}
					else {
						model.company = m.company; //Always keep original company
						next();
					}
				});
			}
			else { //New company
				if (typeof model.company !== undefined && model.company) {
					next();
				}
				else if (typeof model.companyref !== undefined && model.companyref) { //should use this by default in the future to specify company on front end
					model.company = model.companyref;
					next();
				}
				else {
					//TODO: Add multiple companies and select last selected/session 
					Company.findOne({createdBy : user.id}).then(function (company) {
					      if (typeof company === 'undefined' || !company || typeof company.id === 'undefined' || !company.id) {					
							return res.status(403).json({ error: 'Could not retrieve company for user '+ user.username });								
					      }
					      else {
						next();
					      }
					});

				}
			}
			
		})
		.catch(function (err) {
			return res.status(403).json({ error: err });
		});

		
	    });	
};


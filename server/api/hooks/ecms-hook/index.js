var Promise = require('bluebird');

// File api/hooks/ecms-hook/index.js
module.exports = function ecmsHook(sails) {

   // This var will be private
   var foo = 'bar';

   // This var will be public
   this.abc = 123;

   return {

      // This function will be public
      sayHi: function (name) {
         console.log(greet(name));
      },
      configure: function () {
      },
      initialize: function(cb) {

	   var eventsToWaitFor = ['hook:auth:initialized','hook:permissions:initialized', 'hook:orm:loaded'];
	   sails.after(eventsToWaitFor, function() {
		console.log("///Writing Additional Permissions");
		var promises = [];
		promises.push(Role.find({where: {name: 'client'}, limit: 1, sort: 'name ASC'}, { fields: ['name'] }).then(function (results) {
			if (results.length < 1)
				return sails.services.permissionservice.createRole({ name: 'client', users: 'admin', permissions: [{ model: 'company', action: 'read' }] }).then();
			else return 'Client already there';
		}));

		promises.push(Role.find({where: {name: 'registrant'}, limit: 1, sort: 'name ASC'}, { fields: ['name'] }).then(function (results) {
			if (results.length < 1)
				return sails.services.permissionservice.createRole({ name: 'registrant', users: 'admin', permissions: [{ model: 'company', action: 'read' }] }).then();
			else return 'Registrant already exists';
		}));

		//Clear permissions - ensure sails-permissions fixtures don't #$%# with our security
		console.log("///NEED TO MANUALLY CHANGE NODE_MODULES/SAILS_PERMISSIONS/DIST/HOOKS/INDEX (initializeFixtures resolve...permissions) TO PREVENT PERMISSIONS REWRITE");
		promises.push(Permission.destroy({}).then());

		Promise.all(promises)
		.then(function (results) {
			promises = [];
			promises.push(sails.services.permissionservice.grantRole({action: 'read', model: 'photo', role: 'registrant'}));
			promises.push(sails.services.permissionservice.grantRole({action: 'create', model: 'company', role: 'admin'}));
			promises.push(sails.services.permissionservice.grantRole({action: 'read', model: 'company', role: 'admin'}));
			promises.push(sails.services.permissionservice.grantRole({action: 'update', model: 'company', role: 'admin'}));
			promises.push(sails.services.permissionservice.grantRole({action: 'delete', model: 'company', role: 'admin'}));
			promises.push(sails.services.permissionservice.grantRole({action: 'create', model: 'company', role: 'registrant'}));
			promises.push(sails.services.permissionservice.grantRole({action: 'read', model: 'company', role: 'client'}));
			promises.push(Role.findOne({where: {name: 'registered'}}).then(function(result) {
				if (typeof result !== 'undefined' && result)
					return Permission.destroy({relation: "role", role: result.id}).then();
			}));
			return Promise.all(promises)
			.then(function (results) {
				return cb();
			});
		})
		.catch(function(err) {
		   sails.log(err);
		   cb(err);
		});
		
		
		//PermissionService.grant({role: 'collaborator', model: 'Issue', action: 'update', criteria: { where: { public: true }, blacklist: ['public'] } })
		// Finish initializing custom hook
		// Then call cb()
		

	   });
       }

   };

   // This function will be private
   function greet (name) {
      return "Hi, " + name + "!";
   }

};


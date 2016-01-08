var Promise = require('bluebird');

// File api/hooks/ecms-hook/index.js
module.exports = function myHook(sails) {

   // This var will be private
   var foo = 'bar';

   // This var will be public
   this.abc = 123;

   return {

      // This function will be public
      sayHi: function (name) {
         console.log(greet(name));
      },
      initialize: function(cb) {

	   var eventsToWaitFor = ['hook:auth:initialized','hook:permissions:initialized'];
	   sails.after(eventsToWaitFor, function() {

		var promises = [];
		promises.push(Role.find({where: {name: 'client'}, limit: 1, sort: 'name ASC'}, { fields: ['name'] }).then(function (results) {
			if (results.length < 1)
				return sails.services.permissionservice.createRole({ name: 'client', users: 'admin', permissions: [{ model: 'company', action: 'read' }] }).then();
			else return 'already there';
		}));

		promises.push(sails.services.permissionservice.grantRole({action: 'read', model: 'photo', role: 'registered'}));

		console.log("///Writing Additional Permissions");

		//Process serially
		Promise.each(promises, (v,i,t) => {})
		.then(function (results) {
			console.log(results);
			return cb();
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


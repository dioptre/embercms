// File api/hooks/myhook/index.js
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
		sails.services.permissionservice.grant({action: 'read', model: 'photo', role: 'registered'})
		// Finish initializing custom hook
		// Then call cb()
		return cb();

	   });
       }

   };

   // This function will be private
   function greet (name) {
      return "Hi, " + name + "!";
   }

};


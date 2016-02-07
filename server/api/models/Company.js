/**
* Company.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  lookups: {
	
  },

  attributes: {

	autoCreatedBy: true,

	name : { type: 'string', unique: true, index: true},

	description : { type: 'string' },

	hq : { type: 'string' },

	address : { type: 'string' },

	registration : { type: 'string' },	

	createdBy:  {model: 'User', index: true },

	owner: {model: 'User', index: true },

	memberships: { collection: 'membership', via : 'company', includeIn: { list: "link",  detail: "link" }}, //index,record,link

	projects: { collection: 'project', via : 'company', includeIn: { list: "link",  detail: "link" }},
	
	
	toJSON: function() {
		var obj = this.toObject();
		delete users;
		return obj;
	}
		
  }
};


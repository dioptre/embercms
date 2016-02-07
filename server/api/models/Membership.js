/**
* Membership.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

	name : { type: 'string' },

	description : { type: 'string' },

	firstName : { type: 'string' },

	lastName : { type: 'string' },

	email: {type: 'string'},

	registration : { type: 'string' },

	position : { type: 'string' },

	privileges : { type: 'array', defaultsTo: [] },

	projects : { collection: 'project', via: 'memberships' },

	user : { model: 'user' },

	company : { model: 'company' }
  },

};


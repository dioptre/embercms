/**
* Project.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

	name : { type: 'string' },

	description : { type: 'string' },

	completed : { type: 'date' },

	valuation : { type: 'float', defaultsTo: 0 },

	photos: {type: 'array', defaultsTo: []},

	company : { model: 'company' },

	memberships : { collection: 'membership', via: 'projects' , includeIn: { list: "link",  detail: "link" }},

  }
};


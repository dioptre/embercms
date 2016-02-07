var _ = require('lodash');
var _super = require('sails-permissions/api/models/User');
var moment = require("moment");

_.merge(exports, _super);
_.merge(exports, {
  attributes: {

	name : { type: 'string' },

	description : { type: 'string' },

	firstName : { type: 'string' },

	lastName : { type: 'String' },

	membership : {  collection: 'membership', via: 'user' },

	resetPasswordId : {type: 'string'},

	resetPasswordDate : {type: 'datetime', defaultsTo: new Date().toISOString()}, 

	toJSON: function() {
		var obj = this.toObject();
		//delete obj.passports;
		_.map(obj.passports, function(pp) {
			delete pp.password;
			delete pp.createdAt;
			delete pp.updatedAt;

		});
		_.map(obj.roles, function(r) {
			delete r.createdAt;
			delete r.updatedAt;
		});
		_.map(obj.membership, function(m) {
			delete m.description;
			delete m.user;
			delete m.createdAt;
			delete m.updatedAt;
			delete m.owner;
			delete m.createdBy;
		});
		delete obj.createdBy;
		delete obj.owner;
		delete obj.createdAt;
		delete obj.updatedAt;
		delete obj.model;
		delete obj.password;
		//console.log(obj);
		return obj;
	}
  },

  /**
   * Attach default Role to a new User
   */
  afterCreate: [
    function setOwner (user, next) {
      sails.log.verbose('User.afterCreate.setOwner', user);
      User
        .update({ id: user.id }, { owner: user.id })
        .then(function (user) {
          next();
        })
        .catch(function (e) {
          sails.log.error(e);
          next(e);
        });
    },
    function attachDefaultRole (user, next) {

      sails.log('User.afterCreate.attachDefaultRole', user);
      if (user.username === 'admin') {
	next();
	return;
      }
      User.findOne(user.id)
        .populate('roles')
        .then(function (_user) {
          user = _user;
          return Role.findOne({ name: 'registrant' });
        })
        .then(function (role) {
          user.roles.add(role.id);
          return user.save();
        })
        .then(function (updatedUser) {
          sails.log.silly('role "registrant" attached to user', user.username);
          next();
        })
        .catch(function (e) {
          sails.log.error(e);
          next(e);
        })
    }
  ]
});

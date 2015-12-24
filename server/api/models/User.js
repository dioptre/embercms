var bcrypt = require('bcrypt');

/**
* User
*
* @module      :: Model
* @description :: A short summary of how this model works and what it represents.
* @docs    :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    username: {
      type: 'email', // Email type will get validated by the ORM
      required: true,
      unique: true
    },

    //You might want to put this into it's own model if you want to support
    //social logins but keep the same account
    password: {
      type: 'string',
      required: true
    },
    
    toJSON: function() {
      var obj = this.toObject();
      // Remove the password object value
      delete obj.password;
      // return the new object without password
      return obj;
    }
  },

  //salt the password before it gets saved
  beforeCreate: function(user, cb) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          console.log(err);
          cb(err);
        } else {
          user.password = hash;
          cb(null, user);
        }
      });
    });
  }
};

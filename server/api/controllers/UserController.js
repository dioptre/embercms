var _ = require('lodash');
var _super = require('sails-auth/api/controllers/UserController');

_.merge(exports, _super);
_.merge(exports, {

  //isAdmin handled through policies...
  isAdmin: function(req,res) {
    res.json(200, true);
  },

});

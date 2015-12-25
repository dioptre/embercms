/**
* Test.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    test2 : { type: 'float' },
    rand: { type: 'float', index : true} ,
   
    toJSON : function () {
		var obj = this.toObject();
		delete obj.rand;

    }
	
  },
  beforeValidate: function(values, cb) {
	values.rand = Math.random();
	cb();
  }
};


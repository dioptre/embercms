/**
* Page.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  autoPK: false,
  attributes: {

    id : {type: 'string', primaryKey: true, unique: true, columnName: 'title'},

    title : { type: 'string' },

    description : { type: 'string' },

    culture : { type: 'string' },

    theme : { type: 'string' },

    metadata : { type: 'string' },

    category : { type: 'string' },

    subcategory : { type: 'string' },

    type : { type: 'string' },

    subtype : { type: 'string' },

    auth : { type: 'string' },

    parent : { type: 'string' },

    position : { type: 'float' },
    
    sections : {
		collection: 'section',
		via: 'page',
		includeIn: {
			list: "index",
			detail: "record"
		}
		//dominant : true
    },
    
    toJSON : function() {
	var obj = this.toObject();
	obj.title = obj.id;
	return obj;
    },

  }
};


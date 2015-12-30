/**
* Page.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    title : { type: 'string' },

    description : { type: 'string' },

    culture : { type: 'string' },

    category : { type: 'string' },

    type : { type: 'string' },

    subtype : { type: 'string' },

    auth : { type: 'string' },

    parent : { type: 'string' },

    position : { type: 'float' }
  }
};


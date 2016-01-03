/**
* Photo.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    url : { type: 'string' },

    thumb : { type: 'string' },

    title : { type: 'string' },

    description : { type: 'string' },

    culture : { type: 'string' },

    category : { type: 'string' },

    tags : { type: 'string' },

    auth : { type: 'string' },

    reference : { type: 'string' }
  }
};


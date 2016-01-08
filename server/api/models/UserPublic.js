//Query Cache (Redis for lookups)
module.exports = {
  connection:'redis',
  attributes: {

    uuid: { type: 'string', index: true, primaryKey: true }, 
    json: { type: 'string'}, 
	
  },
  beforeValidate: function(values, cb) {
	cb();
  },
};

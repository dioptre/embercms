var ObjectId = require('mongodb').ObjectID;
var uuid = require('node-uuid');
var maxMeg = 2;
var maxBytes = maxMeg*1048576;



/**
 * Get the signature/digest of a supplied input string
 * @param data [Required] The String to encode
 * @param awsSecretKey [Required] Secret key shared with Amazon
 * @param algorithm [Optional] Encryption algorithm, defaults to sha256
 * @param encoding [Optional] The output encoding. Default to base64
 * @returns Str with encoded digest of the input string
 */
module.exports = {
  sign: function(req, res) {
	Token.getUser(req.headers.authorization).then(function(user) {

		if (typeof req === 'undefined' || !req || typeof req.query === 'undefined' || !req.query || typeof req.query.size === 'undefined' 
			|| !Number.isInteger(Number(req.query.size)) || Number(req.query.size) <1 || Number(req.query.size) > maxBytes)
			return res.json(406, {error : "Invalid file size (" + maxMeg +"M max). E_UPLOAD_FILESIZE"});
		if (typeof req.query.name === 'undefined' || !req.query.name || !(/png$/i.test(req.query.name) || /jpeg$/i.test(req.query.name) || /jpg$/i.test(req.query.name))) 
			return res.json(406, {error : "Invalid file type (jpeg,png required). E_UPLOAD_FILETYPE"});
			
		var id = 'pub_' + ObjectId().valueOf();		
		if (typeof user !== 'undefined' && user && typeof user.id !== 'undefined') {
			id = 'own_' + user.id;	
		}
		if (typeof req.query.lastModified === 'string')
			id = id + '_lm' + req.query.lastModified;
		if (typeof req.query.width === 'string' && typeof req.query.height === 'string')
			id = id + '_d' + req.query.width + "x" + req.query.height;
		id = id + '_o_' + uuid.v4().replace(/-/ig, "") + '_';
		id = id + req.query.name;
		
		res.send(sails.config.aws.getToken(id, req.query.type, maxBytes));
	});

  },
};




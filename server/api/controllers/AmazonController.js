var crypto = require("crypto");
var ObjectId = require('mongodb').ObjectID;
var uuid = require('node-uuid');
var Enumerable = require('linq');

var s3 = {
	access_key_id: sails.config.aws.access_key_id
	, secret_key: sails.config.aws.secret_key
	, bucket: sails.config.aws.bucket
	, acl: "public-read"
	, https: "false"
	, error_message: ""
	, pad: function(n) {
		if ((n+"").length == 1) {
			return "0" + n;
		}
		return ""+n;
	}, expiration_date: function() {
		var now = new Date();
		var date = new Date( now.getTime() + (3600 * 1000) );
		var ed = date.getFullYear() + "-" + this.pad(date.getMonth()+1) + "-" + this.pad(date.getDate());
			ed += "T" + this.pad(date.getHours()) + ":" + this.pad(date.getMinutes()) + ":" + this.pad(date.getSeconds()) + ".000Z";
		return ed;
	}
};



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
	TokenService.getUser(function(err,user) {
		var id = 'pub_' + ObjectId().valueOf();		
		if (!err) {
			id = 'own_' + user.id;	
		}
		id = id + '_' + uuid.v4().replace(/-/ig, "") + '_' + req.query.name;
		
		var expiry_date = s3.expiration_date();
		var signatureString = "{\n		'expiration': '" + expiry_date + "',\n"
				+ "		'conditions': [\n"
				+ "				{'bucket': '" + s3.bucket + "'},"
				+ "				{'key': '" + id + "'},"
				+ "				{'acl': '" + s3.acl + "'},"
				+ "				{'Content-Type': '" + req.query.type + "'},"
				+ "				['starts-with', '$key', ''],"
				+ "				['eq', '$success_action_status', '201']\n	]\n}";

		var policy = new Buffer(signatureString).toString('base64').replace(/\n|\r/, '');
		var hmac = crypto.createHmac("sha1", s3.secret_key);
		var hash2 = hmac.update(policy);
		var signature = hmac.digest(encoding="base64");
		res.send({
		    acl: s3.acl,
		    awsaccesskeyid: s3.access_key_id,
		    bucket: s3.bucket,
		    key: id,
		    policy: policy,
		    signature: signature,
		    success_action_status: '201',
		    'Content-Type': req.query.type
		});
	}, req.headers.authorization);

  },
};

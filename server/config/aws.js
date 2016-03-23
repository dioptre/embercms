// set environment variables in production deployments to set secrets
// use from global `sails.config.aws.access_key_id`
//CHANGEME
var crypto = require("crypto");
var ObjectId = require('mongodb').ObjectID;
var uuid = require('node-uuid');
var Enumerable = require('linq');
var moment = require('moment');
var maxMeg = 2;
var maxBytes = maxMeg*1048576;

module.exports.aws = {
  access_key_id: process.env.AWS_ACCESS_KEY_ID || 'KKK',
  secret_key: process.env.AWS_SECRET_KEY || 'KK+KKKKKKKKKKKK',
  bucket: process.env.AWS_BUCKET || 'ecms',
  acl: "public-read",
  https: "false",
  error_message: "",
  getToken: function(name, type, maxBytes) {
	if (typeof maxBytes === 'undefined' || !maxBytes)
		maxBytes =  5368709120; //5G s3 Max
	if (typeof type === 'undefined' || !type)
		type = 'application/octet-stream';
	var expiry_date = moment().add(1, 'hours').toISOString();
	var signatureString = "{\n		'expiration': '" + expiry_date + "',\n"
			+ "		'conditions': [\n"
			+ "				{'bucket': '" + this.bucket + "'},"
			+ "				{'key': '" + name + "'},"
			+ "				{'acl': '" + this.acl + "'},"
			+ "				{'Content-Type': '" + type + "'},"
			+ "				['content-length-range', 1, " + maxBytes + "],"
			+ "				['starts-with', '$key', ''],"
			+ "				['eq', '$success_action_status', '201']\n	]\n}";
	var policy = new Buffer(signatureString).toString('base64').replace(/\n|\r/, '');
	var hmac = crypto.createHmac("sha1", this.secret_key);
	var hash2 = hmac.update(policy);
	var signature = hmac.digest(encoding="base64");
	return {
	    acl: this.acl,
	    awsaccesskeyid: this.access_key_id,
	    bucket: this.bucket,
	    key: name,
	    policy: policy,
	    signature: signature,
	    success_action_status: '201',
	    'Content-Type': type
	};
  }
}

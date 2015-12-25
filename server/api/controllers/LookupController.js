
var crypto = require("crypto");
var ObjectId = require('mongodb').ObjectID;
var uuid = require('node-uuid');
var redis = require('redis');
var Enumerable = require('linq');

module.exports = {
  lookup: function (req,res) {
	if (req.body.type === "usr") {
		if (req.body.prefix && req.body.prefix.length > 3) {
			var red = redis.createClient();
			red.send_command('scan', ['0', 'match', "waterline:usr:uuid:*" + req.body.prefix.toUpperCase() + "*"], function(err,result){
				red.quit();
				res.send(result[1]);
			});
		} 
		else {
			res.json(400, { error: "Expected a longer prefix"});
		}	
		
	}
	else if (req.body.type === "random-test") {
		var query = Test.find().where( {
				rand : {
					'>=' : Math.random()
				},				
			}).limit(5);		
		query.exec(function(err, m) {
			if (err)
				res.json(404, {error : err});
			else
				res.json(m);
		});	
	}
  }
};

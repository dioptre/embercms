var psk = sails.config.sendgrid.psk;
var sendgrid  = require('sendgrid')(psk);
var uuid = require('node-uuid');
var ObjectId = require('mongodb').ObjectID;
var Promise = require('bluebird');
var Enumerable = require('linq');

//Use Like Email.sendEmail

exports.sendEmail = function(subject,from, substitutions, template, text, html) {
      return new Promise(function (resolve, reject) {
	var email = new sendgrid.Email();
	email.addTo(req.body.email);
	email.subject = subject;
	email.from = from;
	Enumerable.forEach(substitions, function(val,i) {
		email.addSubstitution(val[0], val[1]);
	});
	if (typeof template === 'string' && template.length > 0) {
		email.addFilter('templates', 'enable', 1);
		email.addFilter('templates', 'template_id', template);
	}
	else {
		email.text = ' ';
		if (typeof text === 'string' && text.length > 0)
			email.text = text;

		email.html = '&nbsp';
		if (typeof html === 'string' && html.length > 0)
			email.html = html;
      	};
	sendgrid.send(email, function(err, status) {
		if (err)
			return reject(error);
		else
			return resolve(status);

	});
      });     
};

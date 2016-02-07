var psk = sails.config.sendgrid.psk;
var sendgrid  = require('sendgrid')(psk);
var uuid = require('node-uuid');
var ObjectId = require('mongodb').ObjectID;
var Promise = require('bluebird');
var Enumerable = require('linq');

//Use Like Email.sendEmail
//subject,from, substitutions [['old, 'new'],['old2','new2']], template, text, html, to
exports.sendEmail = function(options) {
      return new Promise(function (resolve, reject) {
	var email = new sendgrid.Email();
	email.addTo(options.to);
	email.subject = options.subject;
	email.from = options.from || sails.config.sendgrid.sender;
	if (typeof options.substitutions !== 'undefined' && options.substitutions) {
		Enumerable.forEach(substitions, function(val,i) {
			email.addSubstitution(val[0], val[1]);
		});
	}
	if (typeof options.template === 'string' && options.template.length > 0) {
		email.addFilter('templates', 'enable', 1);
		email.addFilter('templates', 'template_id', options.template);
	}
	else {
		email.text = ' ';
		if (typeof options.text === 'string' && options.text.length > 0)
			email.text = options.text;

		email.html = '&nbsp;';
		if (typeof options.html === 'string' && options.html.length > 0)
			email.html = options.html;
		else
			email.html += email.text;
      	};
	sendgrid.send(email, function(err, status) {
		if (err)
			return reject(new Error(err));
		else
			return resolve(status);

	});
      });     
};

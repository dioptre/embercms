import Ember from 'ember';
import config from './config/environment';
import adminRouter from 'ember-admin/router';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
	adminRouter(this);

	//App
	this.route('protected');

	this.route('company', function() {
		this.route('register');
		this.route('detail', {path : "detail/:id"});
	});

	//Security
	this.route("login");
	this.route("logout");
	this.route("register");


	//CMS
	this.route('page', { path : "page/:id"}, function() {

	});
	this.route('section');
	this.route('translation');
	this.route('photo');

	//Other
	this.route('400', { path: '/*wildcard'});

	this.route('membership');








});



export default Router;

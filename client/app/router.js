import Ember from 'ember';
import config from './config/environment';
import adminRouter from 'ember-admin/router';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  adminRouter(this);
  this.route('test');
  this.route('test2');

  this.resource('user', function() {});

  this.route("login");
  this.route("logout");
  this.route("register");
  this.route('protected');
  this.route('section');
  this.route('translation');
  this.route('photo');

  this.route('page', { path : "page/:id"}, function() {

  });
  
  this.route('400', { path: '/*wildcard'});

});



export default Router;

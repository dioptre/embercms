import Ember from 'ember';
import config from './config/environment';
import adminRouter from 'ember-admin/router';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  adminRouter(this);
  this.route('test');
});

export default Router;

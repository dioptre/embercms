import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  model: function (params, transition) {
	return this.store.findAll('page');
  },
  queryParams: {
	  culture: {
		  refreshModel: true
	  }
  },
  init: function() {
	this._super.apply(this, arguments);
	var _this = this;	
	$(document).ajaxError(function(evt, jqXHR) {
		if (typeof jqXHR === 'object' && jqXHR && typeof jqXHR.responseJSON === 'object' && jqXHR.responseJSON && typeof jqXHR.responseJSON.error === 'string' && jqXHR.responseJSON.error && jqXHR.responseJSON.error.length > 0) {
			if (/invalidPasswords/.test(jqXHR.responseJSON.error))
				return;
		}		
		localStorage.setItem('previousTransition', _this.get('router.url'));
		_this.transitionTo("/400");
	});
  },
  actions: {
    back() {
      this.historyService.back();
    },
    forward() {
      this.historyService.forward();
    },
    error(a) {
      localStorage.setItem('previousTransition', this.get('router.url'));
      this.transitionTo('/400');
    },
  }
});

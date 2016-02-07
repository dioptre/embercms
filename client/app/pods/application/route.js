import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  model: function (params, transition) {
	//this.router.router.recognizer.names
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
	this.Messenger.setup({
	    extraClasses: 'growl-messenger messenger-fixed messenger-on-bottom messenger-on-right',
	    theme: 'ice'
	});
	$(document).ajaxError(function(evt, jqXHR) {
		var error = jqXHR.statusText;
		if (typeof jqXHR.responseJSON === 'object' && typeof jqXHR.responseJSON.error === 'string')
			error = jqXHR.responseJSON.error;
		else if (typeof jqXHR.responseText === 'string' && jqXHR.responseText.length > 5 && !/^\{/.test(jqXHR.responseText))
			error = jqXHR.responseText;
		console.log(jqXHR.responseText);
		_this.Messenger.post({
			  message: "Something unexpected happened. " + error + " (" + jqXHR.status + ").",
			  hideAfter: 10,
			  hideOnNavigate: true,
			  type: "error"
			});
		if (typeof jqXHR === 'object' && jqXHR && typeof jqXHR.responseJSON === 'object' && jqXHR.responseJSON && typeof jqXHR.responseJSON.error === 'string' && jqXHR.responseJSON.error && jqXHR.responseJSON.error.length > 0) {
			if (/invalidPasswords/.test(jqXHR.responseJSON.error))
				return;
			if (/e_upload/i.test(jqXHR.responseJSON.error))
				return;

		}		
		localStorage.setItem('previousTransition', _this.get('router.url'));
		_this.store.unloadAll();
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
    error(err) {
      console.log("Error:", err)
	this.Messenger.post({
	  message: "Something unexpected happened. Please contact the site administrator if the error persists (trace logged to console).",
	  hideAfter: 10,
	  hideOnNavigate: true,
	  type: "error"
	});
      localStorage.setItem('previousTransition', this.get('router.url'));
      if (typeof EmberInspector === 'object')
	throw err;
      this.transitionTo('/400');
    },
    didTransition () {
      Ember.run.once(this, function() {
        //if(!trackingRoute) return;
        console.log("Analytics: " + this.router.get('url'));
        //ga('send', 'pageview', router.get('url'));
      });
    }
  }
});



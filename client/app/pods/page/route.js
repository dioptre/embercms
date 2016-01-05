import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params, transition) {
		var pagename = (params.id.toLowerCase() === 'home') ? "" : params.id;
		this.controllerFor('application').set('pagename', pagename);
	}
});

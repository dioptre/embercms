import Ember from 'ember';

export default Ember.Route.extend({
	setupController: function(controller, model) {
		var _this = this;
		this.store.findRecord('company', model.id).then(function (company) {
			controller.set('model', company);
		});
	}
});

import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params, transition) {
		if (transition.targetName === "company.index")
			this.transitionTo('index');
	}
});

import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function(transition) {
		var home = this.store.peekRecord('page', 'home');
		if (home !== null) {
			transition.abort();
			this.transitionTo('page.index', 'home');
		}
	}
});

import Ember from 'ember';

export default Ember.Route.extend({
	beforeModel: function(t) {
		this.controllerFor('application').send('invalidateSession')
	}
});

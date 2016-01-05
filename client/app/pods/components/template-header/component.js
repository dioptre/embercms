import Ember from 'ember';

export default Ember.Component.extend({
	sitename: function() {
		return (EmberENV.sitename || "").replace(/ /ig, "<br>");
	}.property(),
	pages: function() {
		return this.get('targetObject').controllerFor('application').get('model');
	}.property(),
	actions: {
		invalidateSession: function () {
			this.get('targetObject').controllerFor('application').send('invalidateSession');
		}
	}
});

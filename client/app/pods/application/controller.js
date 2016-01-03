import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['culture'],
	culture: EmberENV.Culture || "en-US"
});

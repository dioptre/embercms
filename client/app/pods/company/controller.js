import Ember from 'ember';

export default Ember.Controller.extend({
	years: function() {
		return Enumerable.range(new Date().getFullYear()-19, 20).toArray().reverse();
	}.property(),
	employees: function(){
		return this.get('model.memberships').sortBy('name');
	}.property('model.memberships.@each.name'),
	lookup_employees: function() {
		return this.get('model.memberships').sortBy('name').map(function (m) {
			return {id : m.get('name'), value: m};
		});
	}.property('model.memberships.@each.name'),
	lookup_projects: function() {
		return this.get('model.projects').sortBy('name').map(function (m) {
			return {id : m.get('name'), value: m};
		});
	}.property('model.memberships.@each.name'),
	projects: function(){
		return this.get('model.projects').sortBy('name');
	}.property('model.projects.@each.name'),
	selectedMember: Ember.computed.alias('model.selectedMember'),
	currentMember: Ember.computed.alias('model.currentMember'),
});

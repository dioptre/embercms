import DS from 'ember-data';

export default DS.Model.extend({
	name: DS.attr('string'),
	hq: DS.attr('string'),
	address: DS.attr('string'),
	registration: DS.attr('string'),
	telephone: DS.attr('string'),
	memberships: DS.hasMany('membership', {async:true}),
	projects: DS.hasMany('project', {async:true}),	
	selectedProjectId: null,
	selectedProject: function() {
		var id = this.get('selectedProjectId');
		if (!id)
			return null;
		var projects = this.get('projects');
		var m = projects.filterBy('id', id).objectAt(0);
		if (typeof m === 'undefined' || !m)
			return projects.pushObject(this.store.createRecord('project', {id : id}));					
		else
			return m;
		
	}.property('selectedProjectId'),
	selectedMemberId: null,
	selectedMember: function() {
		var id = this.get('selectedMemberId');
		if (!id)
			return null;
		var members = this.get('memberships');
		var m = members.filterBy('id', id).objectAt(0);
		if (typeof m === 'undefined' || !m)
			return members.pushObject(this.store.createRecord('membership', {id : id}));					
		else
			return m;
		
	}.property('selectedMemberId'),
	currentMember: function() {
	    var userid = ecms.myUser().user.id;
	    var members = this.get('memberships');
	    return this.get('memberships').filterBy('user', userid).objectAt(0);
	}.property('memberships.@each.name','memberships.@each.id'),
	isShortlisted : function () {
		var _this = this;
		return this.store.filter('company/shortlist/shortlisted', function(shortlist) {
		  return Enumerable.from([shortlist.id]).any("$ === '" + _this.get('id') + "'");
		});
	}.property(),
});

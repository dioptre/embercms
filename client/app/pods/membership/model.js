import DS from 'ember-data';

export default DS.Model.extend({
	name : DS.attr('string'),
	firstName : DS.attr('string'),
	lastName : DS.attr('string'),
	email: DS.attr('string'),
	description : DS.attr('string'),
	isAuthorized : DS.attr('boolean'),
	registration : DS.attr('string'),
	position : DS.attr('string'),	
	organizations : DS.attr('array', {defaultValue: []}),
	privileges : DS.attr('array', {defaultValue: []}),
	projects : DS.hasMany('project',{async:true}),
	user: DS.attr('string'), //TODO belongsTo
	company: DS.belongsTo('company', {async : true}),
});

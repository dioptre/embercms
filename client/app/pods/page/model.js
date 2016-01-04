import DS from 'ember-data';

export default DS.Model.extend({
  _id: function() {
	if (typeof this.get('id') === 'string')
		this.set('title', this.get('id'));
  }.observes('id').on('init'),
  title: DS.attr('string'),
  description: DS.attr('string'),
  culture: DS.attr('string'),
  theme: DS.attr('string'),
  metadata: DS.attr('string'),
  category: DS.attr('string'),
  type: DS.attr('string'),
  subtype: DS.attr('string'),
  auth: DS.attr('string'),
  parent: DS.attr('string'),
  position: DS.attr('number'),
  sections: DS.hasMany('section', {async : true})
});

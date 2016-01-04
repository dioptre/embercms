import DS from 'ember-data';

export default DS.Model.extend({
  page: DS.belongsTo('page', {async: true}),
  title: DS.attr('string'),
  description: DS.attr('string'),
  culture: DS.attr('string'),
  category: DS.attr('string'),
  subcategory: DS.attr('string'),
  metadata: DS.attr('string'),
  type: DS.attr('string'),
  subtype: DS.attr('string'),
  auth: DS.attr('string'),
  position: DS.attr('number')
});

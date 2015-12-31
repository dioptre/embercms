import DS from 'ember-data';

export default DS.Model.extend({
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
  position: DS.attr('number')
});

import DS from 'ember-data';

export default DS.Model.extend({
  url: DS.attr('string'),
  thumb: DS.attr('string'),
  title: DS.attr('string'),
  description: DS.attr('string'),
  culture: DS.attr('string'),
  category: DS.attr('string'),
  tags: DS.attr('string'),
  auth: DS.attr('string'),
  reference: DS.attr('string')
});

import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('string'),
  tid: DS.attr('string'),
  culture: DS.attr('string'),
  title: DS.attr('string'),
  description: DS.attr('string')
});

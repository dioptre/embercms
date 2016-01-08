import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.attr('string'),
  company: DS.attr('string'),
  position: DS.attr('string')
});

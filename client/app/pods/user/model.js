import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  email: DS.attr('string'),
  isAuthorized: DS.attr('string'),
  position: DS.attr('string'),
  disciplines: DS.attr('string'),
  organizations: DS.attr('string'),
  registration: DS.attr('string'),
  provinces: DS.attr('string')
  username: DS.attr('string'),
  password: DS.attr('string'),
  email: DS.attr('string'),
});

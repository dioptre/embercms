// app/helpers/current-date.js
import Ember from 'ember';

export default Ember.Handlebars.registerBoundHelper(function(options) {
  return moment().format('LL'); // Using moments format 'LL'
});

import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['application'],
  title: "400",
  loggedIn: function() {
        if (localStorage.getItem('ember_simple_auth:session') === null)
                return false;
        else
                return true;
  }.property(),
});

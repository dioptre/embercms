import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return Ember.Object.create();
  },
  actions: {
    createUser: function(model) {
      debugger;
      var _this = this;
      Ember.$.ajax({
        url: '/signup',
        type: 'POST',
        data: JSON.stringify({
	  action: 'register',
          user: {
            password: model.get('password'),
            email: model.get('email'),
            username: model.get('username'),
          }
        }),
        contentType: 'application/json'
      }).then(function(/*response*/) {
        _this.transitionTo('login');

      }, function(xhr, status, error) {
        _this.set('errorMessage', error);
      });

    }
  }
});

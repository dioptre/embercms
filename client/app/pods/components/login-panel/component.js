import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.Component.extend(LoginControllerMixin, {
	authenticator: 'simple-auth-authenticator:oauth2-password-grant',
	actions: {
		authenticate: function (options) {
			var _this = this;
			this._super.apply(this,options).then(function (result) {
				var token = localStorage.getItem('ember_simple_auth:session');

				if (typeof token === 'undefined' || !token || token.length < 1) {
					console.log("Error logging in. (E_LOGIN1)");

				} else {
					var pt = localStorage.getItem('previousTransition');					
					if (pt) {
						localStorage.removeItem('previousTransition');	
						_this.get('container').lookup('controller:application').transitionTo(pt);
					}
					else
						_this.get('container').lookup('controller:application').transitionTo('index');
		
				}
			},function (reason) {
				debugger;
				console.log("Error logging in. (E_LOGIN2)");
			});
		}
	}
});

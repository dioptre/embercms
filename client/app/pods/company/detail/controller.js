import Ember from 'ember';
import Company from 'client/pods/company/controller'
export default Company.extend( {
	needs : ['application'],
	application: Ember.computed.alias("controllers.application"),
	shortlisted : function () {
		this.get('controllers.company/shortlist').send('refresh');
	}.on('init'),
	actions: {
		approve: function() {
			//Example
			var _this = this;
			Ember.$.ajax({
			  url: '/company/approval/update',
			  type: 'PUT',
			  data: JSON.stringify({id: this.get('model.id')}), //TODO
			  contentType: 'application/json'
			}).then((response) => {		
				_this.Messenger.post({
				  message: "Approved",
				  hideAfter: 10,
				  hideOnNavigate: true
				});
				_this.get('approved').pushObject(this.get('model.id'));
			},(xhr, status, error) => {
				//Specific Error
			});
			
		},
	},
});

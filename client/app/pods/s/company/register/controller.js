import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['tab'],
	tab: '0',
	tabs: [ {id: '0', title: 'Contact'},
        {id: '1', title: 'Expertise'},
        {id: '2', title: 'Awards'} ],
	actions: {
		debug: function() {
			this.Messenger.post({
			  message: "Debug",
			  hideAfter: 10,
			  hideOnNavigate: true
			});
		},
	},
});

import Ember from 'ember';
import Company from 'client/pods/company/model'

export default Ember.Route.extend({
	queryParams: {
		cid: {
			refreshModel: true,
			//replace: true
		}
	},
	model: function(params, transition) {
		var _this = this;
		return Ember.$.ajax({
		  url: '/company/checkout/' + params.cid,
		  type: 'GET',
		  //data: JSON.stringify({id: companyid}), //TODO
		  contentType: 'application/json'
		}).then((response) => {		
			//this.store.pushPayload('company', {companies: [this.store.normalize('company',response)]});
			this.store.pushPayload('company', this.store.normalize('company',response));
			return response.companies[0].id;
		},(xhr, status, error) => {
			//Specific Error
		}).then((id) => {			
			return this.store.peekRecord('company',id);
		});

	}
});

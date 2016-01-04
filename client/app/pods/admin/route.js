import Ember from 'ember';
import EmberAdminRouteAdmin from 'ember-admin/routes/admin';

export default EmberAdminRouteAdmin.extend({
  beforeModel: function(transition) {
  	Ember.$.ajax({
                url: '/isAdmin',
                type: 'GET',
                //data: null,
                contentType: 'application/json'
            }).then((response) => {
                
            },(xhr, status, error) => { 
                
            });
	return this._super();
  }
});

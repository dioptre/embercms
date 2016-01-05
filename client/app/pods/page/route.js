import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params, transition) {
		var pagename = (params.id.toLowerCase() === 'home') ? "" : params.id;
		this.controllerFor('application').set('pagename', pagename);
		var page = this.store.peekRecord('page', params.id);
		if (!page)
			this.transitionTo('/400');
		return this.store.find('section', {page: params.id, hide: false}).then(function (sections) {
			sections.map(function (section) {
				if (typeof section.get('type') === 'string' && section.get('type') && section.get('type').length > 0 && !/content-/.test(section.get('type')))
					section.set('type', "content-" + section.get('type'));
				else
					section.set('type', "content-raw");
			});			
			return sections;
		});
	}
});

import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['culture'],
	culture: EmberENV.culture || "en-US",
	pagename: "",
	_pagename: function() {
		if (this.get('currentPath') !== "page.index")
			this.set('pagename', this.get('currentPath').replace(/(^.*?)(\..*)/, "$1"));
	}.observes('currentPath'),
});

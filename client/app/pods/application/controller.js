import Ember from 'ember';

export default Ember.Controller.extend({
	queryParams: ['culture'],
	culture: EmberENV.culture || "en-US",
	theme: EmberENV.theme || "blue-grey darken-3",
	_theme: function () {
		var page = this.store.peekRecord('page', this.get('pagename'));
		if (page && typeof page.get('theme') === 'string') {
			
			this.set('theme', page.get('theme'));	
		}
		else {
			this.set('theme', this.get('originaltheme'))
		}
	}.observes('pagename'),	
	originaltheme: null,
	_originaltheme: function() {
		this.set('originaltheme', this.get('theme'));
	}.on('init'),
	pagename: null,
	_pagename: function() {
		if (/^s\./.test(this.get('currentPath')))
			this.set('pagename', this.get('currentPath').replace(/.*\.(.*)/, "$1"));
		else if (this.get('currentPath') !== "page.index")
			this.set('pagename', this.get('currentPath').replace(/(^.*?)(\..*)/, "$1"));
	}.observes('currentPath'),
        _title: function() {
		var pagename = this.get('pagename');
		if (typeof pagename === 'string') {
			pagename = pagename.trim().toUpperCase();
			if (pagename.length > 0)
				pagename+= " - ";			
		}
		else {
			pagename = "";
		}
		Ember.$(document).attr('title', pagename + this.get('sitename'));
	}.observes('pagename'),
	pages: function() {
		return this.store.filter('page', function(pages) {
			return !(pages.get('hide') === true); 
		});

	}.on('init').property(),
	sitename: EmberENV.sitename || "",
	siteheader: function() {
		return this.get('sitename').replace(/ /ig, "<br>");
	}.property('sitename'),
	headertheme: function() {
		return "uppercase " + this.get('theme'); 
	}.property('theme'),
	footertheme: function() {
		return "uppercase footer white-text " + this.get('theme'); 
	}.property('theme'),
});

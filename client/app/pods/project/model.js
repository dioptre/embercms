import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  completed: DS.attr('dateiso'),
  valuation: DS.attr('number'),
  types: DS.attr('array', {defaultValue: []}),
  company: DS.belongsTo('company', {async:true}),
  memberships: DS.hasMany('membership', {async:true}),
  //memberships: DS.hasMany('array'),
  year:  function(key, value, previousValue) {
	var m;
	// setter
	if (arguments.length > 1) {
		if (Number.isInteger(value))
			value = value + "";
		var m = moment.utc(value).toDate()
		this.set('completed', m);
	} else {
		m = this.get('completed');
	}

	// getter	
	if (typeof m === 'undefined' || !m)
		return "";
	return moment.utc(m).year();
  }.property('completed'),
  images: [],
  _images: function() {
	//Ember.run.later(this, function (ctx) {
	this.set('processing', true);
	//}, 200);
	this.updateImages();
	Ember.run.debounce(this, this.updateImages, 4000, false);
  }.observes('photos.[]', 'photos').on('init'),
  updateImages : function(photos) {
	if ( !(this.get('isDestroyed') || this.get('isDestroying')) ) {
		var m = this.get('photos');
		if (typeof m === 'undefined' || !Array.isArray(m))
			this.set('images', []);
		var images = this.get('images');

	  	this.set('images', m.map(function (p) {
			var image = {thumb: p.replace(/(^.+\/\/)([a-zA-Z0-9]+)(\..*\/)(.*)/, '$1$2resized$3resized-$4'), photo: p};
			var dimensions = p.replace(/.*(_d([0-9]+)x([0-9]+))_.*/i, "$2,$3").split(',');
			if (Array.isArray(dimensions) && dimensions.length == 2) {
				image.width = dimensions[0];
				image.height = dimensions[1];
			}
			return image;		
		}).uniq());
	

		this.set('processing', false);
	}
  }
});

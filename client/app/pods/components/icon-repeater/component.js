import Ember from 'ember';


export default Ember.Component.extend({
	repeats: 0,
	repeater: [],
	_repeater: function () {
		var repeater = [];
		for(var i = 0; i < this.get('repeats'); i++)
			repeater.pushObject("");
		this.set('repeater', repeater);
			
	}.observes('repeats').on('init')

});

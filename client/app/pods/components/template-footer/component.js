import Ember from 'ember';

export default Ember.Component.extend({
	copyrighttheme: function() {
		var originaltheme = this.get('theme') + ' copyright-addendum mdl-mini-footer--social-btn';
		if (!/-[1-9]/.test(originaltheme))
			return originaltheme + " darken-4";
		else if (/-[1-2]/.test(originaltheme))
			return originaltheme.replace(/-[1-2]/,"3");
		else
			return originaltheme.replace(/-[3-4]/,"2");
	}.property('theme'),
});

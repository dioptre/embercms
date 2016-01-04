import DS from 'ember-data';

export default DS.Model.extend({
  url: DS.attr('string'),
  _url: function() {
	if (typeof this.get('url') === 'string') {
		this.set('thumb', this.get('url').replace(/(^.+\/\/)([a-zA-Z0-9]+)(\..*\/)(.*)/, '$1$2resized$3resized-$4'));
	}
  }.observes('url'),
  thumb: DS.attr('string'),
  title: DS.attr('string'),
  description: DS.attr('string'),
  culture: DS.attr('string'),
  category: DS.attr('string'),
  tags: DS.attr('string'),
  auth: DS.attr('string'),
  reference: DS.attr('string')
});

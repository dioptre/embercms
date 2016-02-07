import Ember from 'ember';

export default Ember.Component.extend({
	tagName:'',
	content: null, //should be content.id
	lookup: [],
	lookupKeyPath: null,
	lookupValuePath: null,
	contentJoinPath : null,	
	serialized: function () {
		var raw = /(^content$|^$)/i;
		var emb = /^content/i;
		var look = [];
		var lkey = this.get('lookupKeyPath');
		var lval = this.get('lookupValuePath');
		var ljoin = this.get('contentJoinPath');
		var ll = 'lookup';
		var lj = 'content';
		if (emb.test(lkey)) {
			ll = "lookup.content";
			lkey = "get('" + lkey.replace(/^content\./i, "") + "')";
		}
		if (emb.test(lval)) {
			ll = "lookup.content";
			lval = "get('" + lval.replace(/^content\./i, "") + "')";
		}
		if (emb.test(ljoin)) {
			lj = lj + ".content";
			ljoin = "get('" + ljoin.replace(/^content\./i, "") + "')";
		}


		if (raw.test(this.get('lookupKeyPath')) || raw.test(this.get('lookupValuePath')) || !this.get('lookupValuePath')) {
			if (this.get('lookupKeyPath'))
				look = Enumerable.from(this.get(ll)).select("{ id : $." + lkey + ", value : $ }").toArray(); // { label, originalObject}
			else
				look = Enumerable.from(this.get(ll)).select("{ id : $, value : $ }").toArray(); // {originalObject, originalObject}
		}
		else {
			look = Enumerable.from(this.get(ll)).select("{ id : $." + lkey + ", value : $." + lval + " }").toArray(); //{label, value}
		}
		var cont = [];
		if (raw.test(this.get('contentJoinPath')) || !this.get('contentJoinPath')) {
			cont = Enumerable.from(this.get('content')).select("$").toArray();
		} else {
			if (emb.test(this.get('contentJoinPath')) && (typeof this.get('content.length') === 'undefined' || !this.get('content.length')))
				cont = [this.get(this.get('contentJoinPath'))];
			else
				cont = Enumerable.from(this.get(lj)).select("$." + ljoin).toArray(); //{label, value}
		}

		//T[] inner, T outerKeySelector(T), T innerKeySelector(T), T resultSelector(T, T), T compareSelector(T)
		return Enumerable.from(look).join(cont, "$.id", "$", "outer, inner => outer.value").toArray();
		
			


		debugger;
	}.property('content', 'content.[]', 'lookup', 'lookup.[]', 'lookupLabelName', 'lookupValueName', 'contentJoinName')
});

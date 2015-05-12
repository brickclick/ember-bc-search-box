import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		search: function() {
			console.log('search', arguments);
		},
		result: function() {
			console.log('result', arguments);
		}
	}
});
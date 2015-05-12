import Ember from 'ember';

export default Ember.Component.extend({
	actions: {
		fieldFocus: function() {
			this.$('.bc-search-box--selected').removeClass('bc-search-box--selected');
			this.$field.addClass('bc-search-box--selected');
		}
	},

	searchResults: Ember.A([]),

	noResultsMessage: 'No Results',

	didSearch: false,

	hasResults: Ember.computed('searchResults', function() {
		return this.get('searchResults').length > 0;
	}),

	didInsertElement: function() {
		this.$field = this.$('.bc-search-box__field');
	},

	keyDown: function(e) {
		switch(e.keyCode) {
			case 27: // esc
				this.set('didSearch', false);
				this.$('.bc-search-box--selected').removeClass('bc-search-box--selected');
				this.$field.addClass('bc-search-box--selected');

				if(this.ajaxCall) {
					this.ajaxCall.abort();
					this.ajaxCall = null;
				}

				break;
			case 13: // enter
				if(this.$field.hasClass('bc-search-box--selected')) {
					this.sendAction('action', this.$field.val());
				} else {
					if(this.get('hasResults')) {
						var selectedIndex = this.$('.bc-search-box__result.bc-search-box--selected').index();
						this.sendAction('selectResult', this.get('searchResults')[selectedIndex]);
					} else {
						this.sendAction('action', this.$field.val());
					}
				}
				break;
			case 9: // tab
			case 39: // right arrow
			case 40: // down arrow
				e.preventDefault();
				this.selectNextResult();
				break;
			case 38: // up arrow
				e.preventDefault();
				this.selectPreviousResult();
				break;
			default:
				Ember.run.debounce(this, this.doAutocomplete, 500);
		}
	},
	doAutocomplete: function() {
		var me = this;

		if(this.ajaxCall) {
			this.ajaxCall.abort();
		}

		this.ajaxCall = Ember.$.ajax({
			url: this.searchURL,
			data: {
				query: this.value
			},
			dataType: 'JSON',
			success: function(data) {
				me.set('didSearch', true);
				me.set('searchResults', Ember.A((data && data.search) || []));
			},
			error: function() {
				me.set('didSearch', true);
				me.set('searchResults', Ember.A([]));
			}
		});
	},
	selectNextResult: function() {
		var $cur = this.$('.bc-search-box__result.bc-search-box--selected'), $next = $cur.next();
		if($next.length) {
			// Next item
			$cur.removeClass('bc-search-box--selected');
			$next.addClass('bc-search-box--selected');
		} else {
			// End of list, and first down
			if(this.$('.bc-search-box__result .bc-search-box__result').length) {
				$cur.removeClass('bc-search-box--selected');
				this.$field.removeClass('bc-search-box--selected');
				this.$('.bc-search-box__results .bc-search-box__result:first').addClass('bc-search-box--selected');
			} else {
				this.$('.bc-search-box--selected').removeClass('bc-search-box--selected');
				this.$field.addClass('bc-search-box--selected');
			}
		}
	},
	selectPreviousResult: function() {
		var $cur = this.$('.bc-search-box__result.bc-search-box--selected'), $prev = $cur.prev();
		if($prev.length) {
			// Previous item
			$cur.removeClass('bc-search-box--selected');
			$prev.addClass('bc-search-box--selected');
		} else {
			if(this.$('.bc-search-box__result .bc-search-box__result').length) {
				if(this.$field.hasClass('bc-search-box--selected')) {
					this.$field.removeClass('bc-search-box--selected');
					this.$('.bc-search-box__results .bc-search-box__result:last').addClass('bc-search-box--selected');
				} else {
					this.$field.addClass('bc-search-box--selected');
					$cur.removeClass('bc-search-box--selected');
				}
			} else {
				this.$('.bc-search-box--selected').removeClass('bc-search-box--selected');
				this.$field.addClass('bc-search-box--selected');
			}
		}
	}
});

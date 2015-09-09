import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({
	tokenEndpoint: 'http://api.pharmadomicile.fr/oauth/token',
	restore: function(data) {
		return new Ember.RSVP.Promise(function(resolve, reject) {
			if (!Ember.isEmpty(data.token)) {
				resolve(data);
			} else {
				reject();
			}
		});
	},

	authenticate: function(options) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: this.tokenEndpoint,
				type: 'POST',
				data: JSON.stringify({
					grant_type: 'password',
					username: options.identification,
					password: options.password
				}),
				contentType: 'application/json;charset=utf-8',
				dataType: 'json'
			}).then(function(response) {
				Ember.run(function() {
					resolve({
						token: response.access_token
					});
				});
			}, function(xhr, status, error) {
				var response = xhr.responseText;
				Ember.run(function() {
					reject(response);
				});
			});
		});
	},

	invalidate: function() {
		return Ember.RSVP.resolve();
	}
});
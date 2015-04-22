/**
 * Created by bleizzero on 21/04/2015.
 */
var app_routes = {
	"/": game,
	"#": game,
	"#home": game
};

var App = function (){
	/*Private*/
	var container = document.getElementById('index-content');


};
App.prototype.router = {
	/*Tanks to Mike. https://nappysoft.wordpress.com/2013/11/30/implementing-a-simple-native-javascript-app-router/*/
	routes: app_routes,
	error: function ()
	{
		console.log('Switched to \'error\' view.');
		$('#index-content').load('views/404_error.html');
	},
	handle: function (hash)
	{
		var self,hash,route;
		self = this;
		hash = hash;
		route = self.routes[hash];
		if (route) {
			if (typeof self.routes[hash] === 'function') {
				self.routes[hash].call(self);
			}
		} else {
			self.error();
		}
	},
	init: function () {
		var self = this;
		window.addEventListener('hashchange',
			function (event) {
				self.handle.call(self,window.location.hash);
			}, false);
		window.addEventListener('beforeunload',
			function (event) {
				return "Please do not refresh the page";
			}, false);
		window.addEventListener('load',
			function (event) {
				self.handle.call(self,window.location.hash || "/" );
			}, false);
	}

};


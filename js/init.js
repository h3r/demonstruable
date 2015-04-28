/**
 * Created by bleizzero on 21/04/2015.
 */
'use strict';
var newGame;
$(document).ready(function(){
	newGame = new App();
	newGame.router.init();
});
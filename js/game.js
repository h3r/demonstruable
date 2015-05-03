/**
 * Created by bleizzero on 25/04/2015.
 */
'use strict';




var DEBUG = true;
var myApp;
function Player($id,$name){
	this.id = $id;
	this.name = $name || '';
	this.avatar = Math.floor( Math.random() * (8 - 0));
}
function Room($roomName,$player){
	this.name = $roomName;
	this.player = $player;

	this.lienzo;// = new Lienzo('lienzo');
	this.whoPaints;
	this.players = [];
	this.isUpdated = false;

	this.gameIntervalUpdater = {};
	this.gameIntervalSendCurrentDrawing = {};
	//that.room = new Room();
	//console.log(that.server);
	//that.room.players = that.server.getRoomInfo();
	//that.room.lienzo.setAsPainter();
}
Room.prototype = {
	init: function(){
		this.lienzo = new Lienzo('lienzo');
		if(!this.isUpdated){
			this.init();
			return;
		}
		this.startRound();
	},
	startRound: function(){
		var that = this;

		if(this.whoPaints+'' == this.player.id){
			this.lienzo.setAsPainter();

			this.gameIntervalSendCurrentDrawing = setInterval(function(){
				var img = that.lienzo.getImg();
				console.log(img);
				myApp.server.storeData(that.name,img);
			},3000);

		}else{
			this.lienzo.setAsPlayer();
				myApp.server.loadData(that.name,function($data){
					that.lienzo.load($data);
				});
			return;
		}
		this.gameIntervalUpdater = setInterval(function(){
			//console.log(this.lienzo.stroke);
			if(!that.lienzo.strokes || that.lienzo.strokes.length == 0)
				return;
			var sendstrokes = that.lienzo.strokes;
			that.lienzo.strokes = [that.lienzo.strokes[that.lienzo.strokes.length-1]];
			var $msg = {type:'stroke', data:sendstrokes};
			$msg = JSON.stringify($msg);
			myApp.server.sendMessage($msg);

		},17);
	},

	draw: function($data){
		if(!this.lienzo || this.whoPaints+'' == this.player.id)
			return;
		this.lienzo.draw($data);
	}
};

function App(){
	this.server = new SimpleServer();
	this.HASH = 'c5714393f0c5f091321e43b0247aec43';
	this.IP = "84.89.136.194";
	this.PORT = ':7000';

	this.room;

};


App.prototype =  {
	join : function($user,$room){
		if($user == ''){
			console.error('@joinRoom: username cannot be empty.');
			showAlert('@joinRoom: username cannot be empty.', 'alert-danger');
			return;
		}
		$room = ($room == '')? 'default' : $room ;
		var that = this;
		if(!this.server.is_connected){
			this.server.connect(this.IP + this.PORT, this.HASH+$room,
				function() {//on_connect
					if(DEBUG) console.log('joinRoom: {user:\''+ $user +'\' room:\''+ $room +'\'}');
					showAlert('Connected successfully to '+ $room + '@' + that.IP + that.PORT, 'alert-success' );

					var player = new Player(that.server.user_id,$user);
					that.room = new Room($room,player);
					that.refreshRoomPlayers(function(){
						that.anounce();
						loadContent('#app-content','views/game_layout.html',function() { that.room.init();});
					});
				},
				function($autor,$msg){//on_msg
					that.msgManager($autor,$msg);
				});
			return;
		}
		this.server.close();
	},

	refreshRoomPlayers: function($callback){
		var that = this;
		this.room.isUpdated = false;
		this.server.getRoomInfo( this.HASH + this.room.name,function($msg){
			that.room.players = $msg['clients'];
			that.room.whoPaints = $msg['clients'][0];
			that.room.isUpdated = true;
			if($callback && typeof($callback) == "function" )
				$callback.call();
		});
	},

	anounce : function(){
		var msg = { type:'new player', data: this.room.player};
		this.server.sendMessage(msg);
	},

	msgManager : function($autor,$msg){

		var msg = JSON.parse($msg);
		switch(msg['type']){
			case 'new player':
				//console.log('new player' + $msg);
				//responder quien soy
				break;
			case 'stroke':
				if(!msg['data'] || msg['data'].length == 0)
					break;

				this.room.draw(msg['data']);
				//si yo no soy el que pinta
				//myApp.lienzo.draw(msg['data'])
				break;
		}
	}

};
myApp = new App();
$(document).ready(function() {


});

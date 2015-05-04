/**
 * Created by bleizzero on 25/04/2015.
 */
'use strict';


var DEBUG = true;
var myApp;

var words = ["frankfurt","banana","jedi","murcielago","elefante","caramelo","helado","coche","futbol",
	"television","bicicleta","cine","satelite","batman","godzilla","cthulhu","flash","bruja","mickey",
	"helicoptero","rosa","cazafantasmas","coyote","jirafa","zebra","tortuga","hamburguesa","manzana",
	"reloj","brujula","calabaza","jesus","africa","USA","abeja","teatro","doctor","tijeras","profesor",
	"karateka","atlas","demonio","goku","arale","libertad","odio","furia","esclavitud","amor","hierro",
	"jaqueca","astilla","resfriado","muerte","guerra","pestilencia","hambre","casino","pendrive","dvd",
	"luna","licantropia","ajo","grimorio","prision","presidente","pie","zapato","alfiler","alfombra",
	"nesquik","nocilla","quijote","queso","jamon","almendras","cacahuetes","conejo","leon","tigre","grifo"];


function Player($id,$name){
	this.id = $id;
	this.name = $name || '';
	this.avatar = Math.floor( Math.random() * (8 - 0));
	this.lvl = 0;
}
function Room($roomName,$player){

	this.name = ($roomName == '')? 'default' : $roomName ;
	this.player = $player;
	this.lienzo;// = new Lienzo('lienzo');
	this.whoPaints;
	this.players = [];
	this.playerNames = {};
	this.isUpdated = false;
	this.info = {state:'start', timeStamp:null};
	this.canvasSnapshot = null;
	this.gameIntervalUpdater = {};
	this.currentWord = '';
	this.highestNumber = Math.random();
}
Room.prototype = {
	init: function($roomInfo){

		this.lienzo = new Lienzo('lienzo');
		this.highestNumber = Math.random();

		if(!this.isUpdated){
			this.init();
			return;
		}
		if ($roomInfo) {
			switch ($roomInfo.state) {
				case 'start':
					this.startRound($roomInfo.timeStamp);
					break;
				case 'play':
					this.lienzo.clear();
					if(this.canvasSnapshot)
						this.lienzo.load(this.canvasSnapshot);
					this.playing($roomInfo.timeStamp);
					break;
				case 'end':
					this.lienzo.clear();
					if(this.canvasSnapshot)
						this.lienzo.load(this.canvasSnapshot);
					this.endGame($roomInfo.timeStamp);
					break;
			}
		}else {
			this.startRound();
		}
	},
	getAvatar: function($id){
		if(this.playerNames[$id])
			return this.playerNames[$id].avatar;
		return 1;
	},
	getName: function($id){
		if(this.playerNames[$id])
			return this.playerNames[$id].name;
		return 'unknown';
	},
	setTimer: function($time){
				$("#timer").animate({width:"100%"},0).delay(100).animate({width:"0%"},$time);;

	},
	startRound: function($offsetTime){

		console.log('Inicio de partida');

		$("#current-word").html("Be prepared!!!");
		this.info = {state:'start', timeStamp: new Date()};

		this.lienzo.clear();
		this.canvasSnapshot = null;

		//this will be the word used if I end up being the painter:
		this.currentWord = words[Math.floor(Math.random()*words.length)];

		
		myApp.server.sendMessage({type:'turnSelector', data:this.highestNumber});
		
		var dt = 0.0;
		if($offsetTime){
			dt = new Date() - new Date($offsetTime);
			this.info.timeStamp = $offsetTime;
		}

		//Create new Timeout
		this.setTimer(5000-dt);
		setTimeout(this.playing.bind(this),5000-dt);
	},

	playing: function($offsetTime){
		console.log('Jugando');
		$("#current-word").html("???");

		if(this.canvasSnapshot){
			this.lienzo.load(this.canvasSnapshot);
		}
		this.info = {state:'play', timeStamp: new Date()};
		var dt = 0.0;
		if($offsetTime){
			dt = new Date() - new Date($offsetTime);
			this.info.timeStamp = $offsetTime;
		}

		if(this.whoPaints+'' == this.player.id){
			this.lienzo.setAsPainter();
			$('#current-word').html(this.currentWord);
			
			//showtools
			var that = this;
			this.gameIntervalUpdater = setInterval(function(){
				if(!that.lienzo.strokes || that.lienzo.strokes.length == 1 )
					return;
				var strokes = that.lienzo.strokes;
				that.lienzo.strokes = [that.lienzo.strokes[that.lienzo.strokes.length-1]];
				myApp.server.sendMessage({type:'stroke', data:strokes});
			},17);


		}else{

			this.lienzo.setAsPlayer();
			var that = this;
		}
		this.setTimer(60000-dt);
		setTimeout(this.endGame.bind(this), 60000-dt);
	},

	endGame: function($offsetTime){
		if(this.canvasSnapshot){
			this.lienzo.load(this.canvasSnapshot);
		}

		console.log('Fin de Partida');
		this.info = {state:'end', timeStamp: new Date()};
		var dt = 0.0;
		if($offsetTime){
			dt = new Date() - new Date($offsetTime);
			this.info.timeStamp = $offsetTime;
		}
		clearTimeout(this.gameIntervalUpdater);
		this.lienzo.setAsPlayer();
		//animacion "seleccionando el siguiente jugador"
		
		this.highestNumber = Math.random();
		this.whoPaints = this.player.id;
		//this.setTimer(1000-dt);
		setTimeout(this.startRound.bind(this), 1000-dt);
	},

	draw: function($data){
		if(!this.lienzo || this.whoPaints+'' == this.player.id)
			return;
		this.lienzo.draw($data);
	},

	reward: function($id,$word){
		if($id == this.player.id){
			this.player.lvl++;
			showAlert('You won!','alert-success');
			return;
		}
		this.playerNames[$id].lvl++;
		showAlert(this.getName($id)+' won with: '+$word,'alert-success');
	}
};

function App(){
	this.server = new SimpleServer();
	this.HASH = 'c5714393f0c5f091321e43b0247aec43';
	this.IP = "127.0.0.1";//"84.89.136.194";JAVI //88.18.139.30:7000 CASA
	this.PORT = ':7000';

	this.room;

}


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
						if(that.room.players.length === 1)
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

	sendChatMessage: function($msg,$type){
		if($msg === '')
			return;
		this.server.sendMessage({type:'chat',data:{type:$type,data:$msg}});
		$type = (!$type || $type == '')? '' : 'whisper';
		var el = '<div class="chat-item '+ $type +' col-xs-9" style="vertical-align:bottom ">' + $msg + '</div>' +
			'<figure class="chat-avatar col-xs-3">'+
			'<img src="imgs/cards/avatar_'+ this.room.player.avatar +'.jpg" alt="avatar"  width="42">'+
			'<figcaption>'+this.room.player.name+'</figcaption>'+
			'</figure>';
		$('#chat-content').append(el);


	},

	msgManager : function($autor,$msg){

		var msg = JSON.parse($msg);

		switch(msg['type']) {
			case 'new player':
				console.log('msg:new player');
				if (this.room.whoPaints + '' == this.room.player.id) {
					var canvasSnapshot = this.room.lienzo.getImg();

					this.server.sendMessage(JSON.stringify({
						type: 'canvas',
						data: canvasSnapshot
					}), [msg['data'].id]);

					this.server.sendMessage(JSON.stringify({
						type: 'roomState',
						data: this.room.info
					}), [msg['data'].id]);


					/*this.server.storeData(this.HASH+this.room.name, JSON.stringify(canvasSnapshot),function(){
					 that.server.sendMessage(JSON.stringify({type:'canvas',data:canvasSnapshot}));
					 });*/
				}
				this.server.sendMessage(JSON.stringify({
					type: 'player',
					data: this.room.player
				}), [msg['data'].id]);
				this.room.playerNames[ msg['data'].id ] = msg['data'];
				break;
			case 'player':
				console.log('msg:player');
				this.room.playerNames[ msg['data'].id ] = msg['data'];
				break;
			case 'stroke':
				console.log('msg:stroke');
				if (!msg['data'] || msg['data'].length == 0)
					break;
				if (this.room.whoPaints + '' != this.room.player.id)
					this.room.draw(msg['data']);
				break;

			case 'canvas':
				console.log('msg:canvas');
				if (this.room.whoPaints + '' != this.room.player.id) {

					//
					var that = this;
					var myInterval = setInterval(function(){
						if(!that.room.lienzo)
							return;
						that.room.lienzo.load(msg['data']);
						clearInterval(myInterval);
					},250);


					/*var that = this;
					 this.server.loadData(this.HASH+this.room.name, function($data){
					 var canvasSnapshot = JSON.parse($data);
					 that.room.lienzo.load($data);
					 });*/
				}
				break;
			case 'roomState':
				console.log('msg:roomState');
				var that = this;
				loadContent('#app-content', 'views/game_layout.html', function () {
					that.room.init(msg['data']);
				});
				break;

			case 'disconnected':
				if (this.room.whoPaints + '' == $autor)
					this.refreshRoomPlayers();
				break;
				if(this.room.playerNames[$autor+''])
					delete this.room.playerNames[$autor+''];

				
			case 'turnSelector':
				if (msg['data'] > this.room.highestNumber){
					this.room.highestNumber = msg['data'];
					this.room.whoPaints = $autor;
					console.log("it's not my turn :(");
				}else {
					//this.room.whoPaints = this.room.player.id;
					//console.log("it's my turn! :)");
				}

				break;
			case 'chat':
				if (this.room.whoPaints + '' == this.room.player.id){
					if(msg['data']['data'] == this.room.currentWord)
						this.room.reward($autor,msg['data']['data']);
					this.server.sendMessage({type:'winner',data:{who:$autor,word:msg['data']['data']}});
				}
				console.log('msg: chat message');
				var el = '<div class="chat-item '+msg['data']['type']+' col-xs-9" style="vertical-align:bottom ">' + msg['data']['data'] + '</div>' +
					'<figure class="chat-avatar col-xs-3">'+
						'<img src="imgs/cards/avatar_'+ this.room.getAvatar($autor) +'.jpg" alt="avatar"  width="42">'+
						'<figcaption>'+this.room.getName($autor)+'</figcaption>'+
					'</figure>';
				$('#chat-content').append(el);

				break;
			case 'winner':
				console.log('msg:winner');
				this.room.reward( msg['data']['who'], msg['data']['word']);
				break;



		}
	}

};
myApp = new App();
$(document).ready(function() {


});

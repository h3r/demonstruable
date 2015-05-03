'use strict';

function L_dist($a,$b){
	return Math.sqrt(Math.pow($b.x - $a.x,2)+Math.pow($b.y-$a.y,2));
};

function L_ang($a,$b){
	return Math.atan2($b.x-$a.x,$b.y-$a.y);
};

function Tool($name, $draw){
	this.name = $name;
	this.draw = $draw;
};

function Lienzo($canvas){

	var that = this;

	this.oW = 840;
	this.oH = 594;

	this.scaleX=1.0;
	this.scaleY=1.0;

	//tools
	this.eraser = new Tool('eraser',
		function($a,$b){
			//that.context.lineJoin = "round";
			that.context.globalCompositeOperation = "destination-out";
			var dist = L_dist($a,$b);
			var angle = L_ang($a,$b);
			for(var i=0; i< dist; i+=5){
				var x = $a.x + (Math.sin(angle)*i);
				var y = $a.y + (Math.cos(angle)*i);
				var brush = that.context.createRadialGradient(x,y,10,x,y,20);

				brush.addColorStop(0.046, 'rgba(0, 0, 0, 1.0)');
				brush.addColorStop(0.9, 'rgba(0, 0, 0, 0.9)');
				brush.addColorStop(1.0, 'rgba(0, 0,0, 0.000)');

				that.context.fillStyle = brush;
				that.context.fillRect(x-20, y-20, 40, 40);
			}
		}
	);

	this.marker = new Tool('marker',
		function($a,$b){
			//that.context.lineJoin = "round";
			that.context.globalCompositeOperation = "source-over";
			var dist = L_dist($a,$b);
			var angle = L_ang($a,$b);
			for(var i=0; i< dist; i+=5){
				var x = $a.x + (Math.sin(angle)*i);
				var y = $a.y + (Math.cos(angle)*i);
				var brush = that.context.createRadialGradient(x,y,10,x,y,20);

				brush.addColorStop(0.046, 'rgba(0, 0, 0, 0.0500)');
				brush.addColorStop(0.123, 'rgba(0, 0, 0, 0.0218)');
				brush.addColorStop(0.672, 'rgba(0, 0,0, 0.000)');

				that.context.fillStyle = brush;
				that.context.fillRect(x-20, y-20, 40, 40);
			}
		}
	);

	this.ink = new Tool('ink',
		function($a,$b){
			//that.context.lineJoin = "round";
			that.context.globalCompositeOperation = "source-over";
			var dist = L_dist($a,$b);
			var angle = L_ang($a,$b);
			for(var i=0; i< dist; i+=1){
				var x = $a.x + (Math.sin(angle)*i);
				var y = $a.y + (Math.cos(angle)*i);
				var brush = that.context.createRadialGradient(x,y,1.25,x,y,5);

				brush.addColorStop(0.0, 'rgba(0, 0, 0, 0.2)');
				brush.addColorStop(0.1, 'rgba(0, 0, 0, 0.1)');
				brush.addColorStop(1.0, 'rgba(0, 0,0, 0.000)');

				that.context.fillStyle = brush;
				that.context.fillRect(x-5, y-5, 10, 10);
			}
		}
	);
	
	//drawing status
	this.pressing = false;
	//selected tool if local
	this.currentTool = this.marker;
	this.oldPosition = null;
	//array of strokes to send
	this.strokes = [];

	this.canvas = document.getElementById($canvas);
	this.context = this.canvas.getContext("2d");


	//this.oldHeight = document;


	this.resizeCanvas = function(){

		that.scaleX = that.oW  / that.canvas.offsetWidth;
		that.scaleY = that.oH / that.canvas.offsetHeight;


	};
	that.resizeCanvas();
	$(window).resize(that.resizeCanvas);

	this.selectTool=function($tool){
		this.currentTool = this[$tool];
	};
	//simple draw function
	this.draw = function(strokes){

		if(!this.context)
			return false;

		for(var i=0; i<strokes.length; ++i){
			if(!strokes[i+1]){
				return;
			}else if(strokes[i].mouseUp){
				continue;
			}
			this.selectTool(strokes[i].tool);

			this.currentTool.draw(
				{
					x:strokes[i].x * this.canvas.width,
					y:strokes[i].y * this.canvas.height
				},
				{
					x:strokes[i+1].x * this.canvas.width,
					y:strokes[i+1].y * this.canvas.height
				});
  		}
	};

	//Draw function that simulates drawing
	this.simulatedDraw = function(strokes){
	};
	//load image into canvas
	this.load = function($image){
		console.log($image instanceof String);
		var tmpImg = new Image();
		tmpImg.src = "data:image/png;base64,"+$image.toString();
		this.clear();
		this.context.drawImage(tmpImg,0, 0, this.canvas.width, this.canvas.height);
	};
	//clears canvas
	this.clear = function(){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	};

	this.getImg = function(){
		var uri = this.canvas.toDataURL('image/png');
		return uri.slice(uri.indexOf(',') + 1);
	}

	//functions for local drawing and stroke array generation
	this.doMouseDown = function(e){
		e.preventDefault();
		//console.log(this);
		var rect = this.canvas.getBoundingClientRect();

		var mouseX = ( e.clientX - rect.left ) / this.canvas.width*this.scaleX;
  		var mouseY = ( e.clientY - rect.top  ) / this.canvas.height*this.scaleY;
		console.log(e.clientX - rect.left);
		console.log( this.canvas.width);
		console.log( $('#lienzo').width());
  		this.pressing = true;
  		this.oldPosition = {
			x: mouseX,
			y: mouseY,
			tool: this.currentTool.name
		};
		this.draw([
				this.oldPosition,
				{
					x: mouseX,
					y: mouseY,
					tool: this.currentTool.name
				}
		]);

		//console.log(this.oldPosition);
  		this.strokes.push(this.oldPosition);
	};

	this.doMouseMove = function(e){
		e.preventDefault();

		if(!this.pressing) 
			return;

		var rect = this.canvas.getBoundingClientRect();

		var mouseX = (e.clientX - rect.left) / this.canvas.width * this.scaleX;
  		var mouseY = (e.clientY - rect.top) /  this.canvas.height * this.scaleY;

		var stroke = {
			x:mouseX,
			y:mouseY,
			tool:this.currentTool.name
		};

		this.strokes.push(stroke);
		this.draw([this.oldPosition, stroke]);
		this.oldPosition = stroke;

	};

	this.doMouseUp = function(e){
		e.preventDefault();

		this.pressing = false;
		if(this.strokes[this.strokes.length-1]){
			this.strokes[this.strokes.length-1].mouseUp = true;
		}
	};

	this.setAsPainter = function(){
		console.log('setAsPainter');
		this.clear();
		this.canvas.addEventListener("mousedown",this.doMouseDown.bind(this),false);
		this.canvas.addEventListener("mousemove",this.doMouseMove.bind(this),false);
		this.canvas.addEventListener("mouseup",this.doMouseUp.bind(this),false);
		this.canvas.addEventListener("mouseleave",this.doMouseUp.bind(this),false);
	};

	this.setAsPlayer = function(){
		console.log('setAsPlayer');
		var clonCanvas = this.canvas.cloneNode(true);
		this.canvas.parentNode.replaceChild(clonCanvas, this.canvas);
		this.canvas = clonCanvas;
	 	this.context = this.canvas.getContext("2d");
	};


}

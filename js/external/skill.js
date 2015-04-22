// Skill First Part
function drawProgress(percent,deg){
  
  // Adjust Value Here
  //var percent = 30;
  
	$('div.skill_1').html('<div class="percent"></div><div id="slice"'+(percent > 45?' class="gt50"':'')+'><div class="pie"></div>'+(percent > 50?'<div class="pie fill"></div>':'')+'</div>');
	
	//var deg = 360/85*percent;
	//var deg=percent*3.6;
	$('#slice .pie').css({
		'-moz-transform':'rotate('+deg+'deg)',
		'-webkit-transform':'rotate('+deg+'deg)',
		'-o-transform':'rotate('+deg+'deg)',
		'transform':'rotate('+deg+'deg)'
	});
	$('.percent').html('<p>' + Math.round(percent)+'%</p>');
}

$(document).ready(function(){
  
  var p1 = 0;
  drawProgress(p1,0);

var interval = window.setInterval(function() {
  p1 += 1;
   var deg=p1*3.6;
   drawProgress(p1,deg);
   
   if ( p1 == 30 ) clearInterval(interval);  // Skill 1 value Here
}, 80);

});

// Skill Second Part

function drawProgress1(percent_2,deg){
  
  // Adjust Value Here
  //var percent_2 = 30;
  
	$('div.skill_2').html('<div class="percent_2"></div><div id="slice2"'+(percent_2 > 45?' class="gt50"':'')+'><div class="pie"></div>'+(percent_2 > 50?'<div class="pie fill"></div>':'')+'</div>');
	
	//var deg = 360/85*percent_2;
	//var deg=percent_2*3.6;
	$('#slice2 .pie').css({
		'-moz-transform':'rotate('+deg+'deg)',
		'-webkit-transform':'rotate('+deg+'deg)',
		'-o-transform':'rotate('+deg+'deg)',
		'transform':'rotate('+deg+'deg)'
	});
	$('.percent_2').html('<p>' + Math.round(percent_2)+'%</p>');
}


$(document).ready(function(){
  
  var p2 = 0;
  drawProgress1(p2,0);

var interval2 = window.setInterval(function() {
  p2 += 1;
  
     var deg=p2*3.6;
  drawProgress1(p2,deg);
  if ( p2 == 50 ) clearInterval(interval2);  // Skill 2 value Here
  
}, 80);

});

// Skill Third Part

function drawProgress2(percent_3,deg){
  
  // Adjust Value Here
  //var percent_3 = 30;
  
	$('div.skill_3').html('<div class="percent_3"></div><div id="slice3"'+(percent_3 > 45?' class="gt50"':'')+'><div class="pie"></div>'+(percent_3 > 50?'<div class="pie fill"></div>':'')+'</div>');
	
	//var deg = 360/85*percent_3;
	 // var deg=percent_3*3.6;
	$('#slice3 .pie').css({
		'-moz-transform':'rotate('+deg+'deg)',
		'-webkit-transform':'rotate('+deg+'deg)',
		'-o-transform':'rotate('+deg+'deg)',
		'transform':'rotate('+deg+'deg)'
	});
	$('.percent_3').html('<p>' + Math.round(percent_3)+'%</p>');
}


$(document).ready(function(){
  
  var p3 = 0;
  drawProgress2(p3,0);

var interval3 = window.setInterval(function() {
  p3 += 1;
     var deg=p3*3.6;
  drawProgress2(p3,deg);
   if ( p3 == 60 ) clearInterval(interval3);  // Skill 3 value Here
}, 80);

});

// Skill Fourth Part

function drawProgress3(percent_4,deg){
  
  // Adjust Value Here
  //var percent_4 = 30;
  
	$('div.skill_4').html('<div class="percent_4"></div><div id="slice4"'+(percent_4 > 45?' class="gt50"':'')+'><div class="pie"></div>'+(percent_4 > 50?'<div class="pie fill"></div>':'')+'</div>');
	
	//var deg = 360/85*percent_4;
	
	$('#slice4 .pie').css({
		'-moz-transform':'rotate('+deg+'deg)',
		'-webkit-transform':'rotate('+deg+'deg)',
		'-o-transform':'rotate('+deg+'deg)',
		'transform':'rotate('+deg+'deg)'
	});
	$('.percent_4').html('<p>' + Math.round(percent_4)+'%</p>');
}


$(document).ready(function(){
  
  var p4 = 0;
  drawProgress3(p4,0);

var interval4 = window.setInterval(function() {
  p4 += 1;
  var deg=p4*3.6;
  drawProgress3(p4,deg);
  if ( p4 == 70 )  clearInterval(interval4); // Skill 4 value Here
  
}, 80);

});







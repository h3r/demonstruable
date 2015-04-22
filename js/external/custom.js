//On Blur On Focus  
$(document).ready(function() {

$('#uname').blur(function(){
var un_val=$(this).val();
if($.trim(un_val)=="" || un_val=="Your Name")
$(this).val("Your Name");
});

$('#uname').focus(function(){
var un_val=$(this).val();
if(un_val=="Your Name")
$(this).val("");
});

$('#email').blur(function(){
var em_val=$(this).val();
if($.trim(em_val)=="" || em_val=="Email")
$(this).val("Email");
});

$('#email').focus(function(){
var em_val=$(this).val();
if(em_val=="Email")
$(this).val("");
});

$('#Message').blur(function(){
var m_val=$(this).val();
if($.trim(m_val)=="" || m_val=="Message")
$(this).val("Message");
});

$('#Message').focus(function(){
var m_val=$(this).val();
if(m_val=="Message")
$(this).val("");
});

$('#search').blur(function(){
var se_val=$(this).val();
if($.trim(se_val)=="" || se_val=="Search")
$(this).val("Search");
});

$('#search').focus(function(){
var se_val=$(this).val();
if(se_val=="Search")
$(this).val("");
});

});
//bx Slider 
$(document).ready(function(e) {
$('.bxslider').bxSlider({
  auto: true,
  autoControls: true
}); 
//Home Drop Down Menu 
$('.cmb>option:eq(0)').attr('selected',true);
$('.cmb').change(function(){
window.location = $(this).val();
});
//Portfolio Sorting Filter 
jQuery(document).ready(function(e) {
	jQuery(function () {
		
		var filterList = {
		
			init: function () {
			
				// MixItUp plugin
				// http://mixitup.io
				jQuery('#portfoliolist').mixitup({
					targetSelector: '.portfolio',
					filterSelector: '.filter',
					effects: ['fade'],
					easing: 'snap',
					// call the hover effect
					onMixEnd: filterList.hoverEffect()
				});				
			
			},
			
			hoverEffect: function () {
			
				// Simple parallax effect
				jQuery('#portfoliolist .portfolio').hover(
					function () {
						jQuery(this).find('.label').stop().animate({bottom: 0}, 200, 'easeOutQuad');
						jQuery(this).find('img').stop().animate({top: -30}, 500, 'easeOutQuad');				
					},
					function () {
						jQuery(this).find('.label').stop().animate({bottom: -40}, 200, 'easeInQuad');
						jQuery(this).find('img').stop().animate({top: 0}, 300, 'easeOutQuad');								
					}		
				);				
			
			}

		};
		
		// Run the show!
		filterList.init();
		
		
	});	
	   
});




});
//preloader  

// makes sure the whole site is loaded
jQuery(window).load(function() {
        // will first fade out the loading animation
	jQuery("#status").fadeOut();
        // will fade out the whole DIV that covers the website.
	jQuery("#preloader").delay(1000).fadeOut("slow");
})


$(document).ready(function() {

$('.btnValidate').click(function(e) {
	var sEmail = $('.txtEmail').val();
	if ($.trim(sEmail).length == 0) {
		alert('Please enter valid email address');
		e.preventDefault();
	}
	if (validateEmail(sEmail)) {
		alert('Email is valid');
	}
	else {
		alert('Invalid Email Address');
		e.preventDefault();
	}
});


function validateEmail(sEmail) {
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (filter.test(sEmail)) {
        return true;
    }
    else {
        return false;
    }
}

// HOme SLIDER AUTO SLIDER
$('.carousel').carousel({
interval: 2000
})

});











/**
 * Created by bleizzero on 25/04/2015.
 */

/**
 *
 * @param dom_query
 * @returns JSON object with form data as key:value pairs
 */
function getFormData(dom_query){
	var out = {};
	var s_data = $(dom_query).serializeArray();
	//transform into simple data/value object
	for(var i = 0; i<s_data.length; i++){
		var record = s_data[i];
		out[record.name] = record.value;
	}
	return out;
}

/**
 *
 * @param message
 * @param alerttype may be 'alert-success', 'alert-info', 'alert-warning', 'alert-danger'
 */
function showAlert(message,alerttype) {

	$('#alert_placeholder_inner').append('<div id="alertdiv"  role="alert" class=" col-xs-10 col-sm-4 col-md-4 alert alert-dismissable ' +  alerttype + '"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button><p>'+message+'</p></div>');
	setTimeout(function() { // this will automatically close the alert and remove this if the users doesnt close it in 5 secs
		$("#alertdiv").remove();
	}, 3000);
}

function contentLoaded($callback){
	//close the loading modal
	console.log('content loaded');
	if($callback && typeof($callback) == "function" )
		$callback.call();
}

/**
 *
 * @param $placer
 * @param $url
 * @param $callback
 */
function loadContent($placer,$url,$callback){
	//show a "loading" modal
	console.log('loading content');
	$($placer).load($url,$callback);
	//window.location.replace($url);
}




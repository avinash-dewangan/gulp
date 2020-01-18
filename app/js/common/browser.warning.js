// detect IE
var ieclose = false;
$(document).delegate(".grammerly-close", "click", function() {
	$('#grammerly-page').slideUp();
	event.preventDefault();
});
	
var IEversion = detectIE();
if (IEversion !== false) {
	//IE identified
	if($('#SystemBroadcast').length){
		$( "#SystemBroadcast" ).before( "<div id='grammerly-page' class='no-padding col-xs-12 ie-detected'>" +
				"<div class='col-xs-12 grammerly-back container'>" +
				"<div class='col-md-1 col-sm-1 col-xs-1 exclamcolor-fa-fa ie-detected-logo'>" +
				"<i class='fa fa-exclamation-triangle'></i></div>" +
				"<div class='col-md-9 col-sm-12 col-xs-12  grammerly-respons-message '>" +
				"<span class='grammarly-detected ie-detected-message'>Outdated Browser Detected: </span> You are using a version of Internet Explorer that is no longer supported by Microsoft. This may result in anomalies or errors while viewing this site. Supported browsers include: Google Chrome, Microsoft Edge, Mozilla Firefox, and Safari.</b>" +
				"</div>" +
				"<div class='col-md-2 col-sm-2 col-xs-4 ie-detected-close'>" +
				"<div class='col-md-12 col-xs-12 col-sm-12 grammerly-close ie-detected-close-button'>Close &#10005</div>" +
				"</div></div></div></div></div>" );
	}
	$('#grammerly-page').show();
}
/*<div id="grammerly-page" class="ie-detected">
<div class="col-xs-12 grammerly-back">
	<div class="col-md-1 col-sm-1 col-xs-1 exclamcolor-fa-fa ie-detected-logo">
		<i class="fa fa-exclamation-triangle"></i>
	</div>
	<div class="col-md-9 col-sm-12 col-xs-12  grammerly-respons-message ">
		<span class="grammarly-detected ie-detected-message">Outdated Browser Detected: </span> You are using a version of Internet Explorer that is no longer supported by Microsoft. This may result in anomalies or errors while viewing this site. Supported browsers include: Google Chrome, Microsoft Edge, Mozilla Firefox, and Safari.</b>
	</div>
	<div class="col-md-2 col-sm-2 col-xs-4 ie-detected-close">
		<div class="col-md-6 col-md-offset-10 col-xs-12 col-sm-12 grammerly-close ie-detected-close-button">Close &#10005</div>
	</div>
</div>
</div>
</div>
</div>*/
/**
 * detect IE
 * returns version of IE or false, if browser is not Internet Explorer
 */
function detectIE() {
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf('MSIE ');
	if (msie > 0) {
		// IE 10 or older => return version number
		return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	}
	var trident = ua.indexOf('Trident/');
	if (trident > 0) {
		// IE 11 => return version number
		var rv = ua.indexOf('rv:');
		return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	}
	// other browser
	return false;
}

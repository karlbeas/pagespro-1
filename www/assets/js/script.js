var SERVER_API = "https://pagespro.cm/";

/* les modals pagespro */
$('.pagespro-modal-rideau').hide();
$('.close-modal').click(function(){
	CloseModalURL();
});
function OpenModalURL(url)
{
	$('.pagespro-modal-rideau').show();
	$('.pagespro-modal-frame').attr("src", url);
	$('.pagespro-modal-content').css("top", "30px");
}
function CloseModalURL()
{
	$('.pagespro-modal-content').css("top", "calc(300vw + 10px)");
	$('.pagespro-modal-rideau').hide();
}
function TestConnexion()
{
	$.ajax({
		method: "POST",
		url: SERVER_API + "dev/check_internet_connexion/",
		data: { id: 'pagespro' }
	})
	.done(function( msg ) 
	{
		if(msg == "OK")
		{
			localStorage['internet'] = '1';
		}
		else
		{
			localStorage['internet'] = '0';
		}
		//console.log(msg);
	})
	.fail(function (jqXHR, textStatus, errorThrown) 
	{ 
		localStorage['internet'] = '0';
	});
}

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    	StatusBar.hide();
	
	localStorage['device_uuid'] 		= device.uuid;
	localStorage['device_serial'] 		= device.serial;
	localStorage['device_platform'] 	= device.platform;
	localStorage['device_manufacturer']	= device.manufacturer;
	localStorage['device_model']		= device.model;
}

function alertDismissed() {
    // do something
}



function base64(file, callback){
	var coolFile = {};
	function readerOnload(e){
		var base64 = btoa(e.target.result);
		coolFile.base64 = base64;
		callback(coolFile)
	};

	var reader = new FileReader();
	reader.onload = readerOnload;

	var file = file[0].files[0];
	coolFile.filetype = file.type;
	coolFile.size = file.size;
	coolFile.filename = file.name;
	reader.readAsBinaryString(file);
}

/* Fonctions génériques */
(function($){
    $.fn.shake = function(settings) {
        if(typeof settings.interval == 'undefined'){
            settings.interval = 100;
        }

        if(typeof settings.distance == 'undefined'){
            settings.distance = 10;
        }

        if(typeof settings.times == 'undefined'){
            settings.times = 4;
        }

        if(typeof settings.complete == 'undefined'){
            settings.complete = function(){};
        }

        $(this).css('position','relative');

        for(var iter=0; iter<(settings.times+1); iter++){
            $(this).animate({ left:((iter%2 == 0 ? settings.distance : settings.distance * -1)) }, settings.interval);
        }

        $(this).animate({ left: 0}, settings.interval, settings.complete);  
    }; 
    $.fn.bounce = function(settings) {
        if(typeof settings.interval == 'undefined'){
            settings.interval = 100;
        }

        if(typeof settings.distance == 'undefined'){
            settings.distance = 10;
        }

        if(typeof settings.times == 'undefined'){
            settings.times = 4;
        }

        if(typeof settings.complete == 'undefined'){
            settings.complete = function(){};
        }

        $(this).css('position','relative');

        for(var iter=0; iter<(settings.times+1); iter++){
            $(this).animate({ top:((iter%2 == 0 ? settings.distance : settings.distance * -1)) }, settings.interval);
        }

        $(this).animate({ top: 0}, settings.interval, settings.complete);  
    };


	
	
	
	jQuery.fn.putCursorAtEnd = function() {

	  return this.each(function() {
		
		// Cache references
		var $el = $(this),
			el = this;

		// Only focus if input isn't already
		if (!$el.is(":focus")) {
		 $el.focus();
		}

		// If this function exists... (IE 9+)
		if (el.setSelectionRange) {

		  // Double the length because Opera is inconsistent about whether a carriage return is one character or two.
		  var len = $el.val().length * 2;
		  
		  // Timeout seems to be required for Blink
		  setTimeout(function() {
			el.setSelectionRange(len, len);
		  }, 1);
		
		} else {
		  
		  // As a fallback, replace the contents with itself
		  // Doesn't work in Chrome, but Chrome supports setSelectionRange
		  $el.val($el.val());
		  
		}

		// Scroll to the bottom, in case we're in a tall textarea
		// (Necessary for Firefox and Chrome)
		this.scrollTop = 999999;

	  });

	};

})(jQuery);

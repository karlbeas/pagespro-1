var lat = 0;
var lon = 0;
var ville = "";

var json = JSON.parse( localStorage["recherche"] );

jQuery(document).ready(function($) {
	
	var onSuccess = function(position) {
			  
		lat = position.coords.latitude;
		lon = position.coords.longitude;
		
		localStorage["geo_lat"] = lat;
		localStorage["geo_lon"]	= lon;
		
		if((lat != 0) && (lon != 0))
		{
			$.ajax({
				method: "GET",
				url: "https://us1.locationiq.com/v1/reverse.php?key=64bff99679e333&lat="+lat+"&lon="+lon+"&format=json"
			})
			.done(function( msg ) {
				address = msg.address;
				address_display = msg.display_name;
				
				localStorage["geo_address"]	= address_display;
				
				ville = address.city;
				ville = ville.replace(" III", "");
				ville = ville.replace(" II", "");
				ville = ville.replace(" IV", "");
				ville = ville.replace(" VIII", "");
				ville = ville.replace(" VII", "");
				ville = ville.replace(" VI", "");
				ville = ville.replace(" I", "");
				ville = ville.replace(" V", "");
				ville = ville.replace("é", "e");
				
				localStorage["geo_ville"]	= ville;
				
				$("#ville").html(ville);
				$("#address").html(address_display);
			});
		}
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
	
	
});

/* Le champ recherche et l'ajout dans l'historique interne */
$("#champ-recherche").change(function(){	
	
	ajout_historique();
	
});

function ajout_historique()
{
	$recherche = $("#champ-recherche").val();
	
	json = JSON.parse( localStorage["recherche"] );
	trouve = 0;
	
	Object.keys( json ).sort(function( a,b ) {
		return json[a].mot.localeCompare( json[b].mot );
	}).forEach(function( key ) {
		if(json[key].mot == $recherche.trim())
		{
			trouve++;
		}
	});
	if(trouve == 0)
	{
		
		if(($recherche != '') && ($recherche.length > 2))
		{
			json[RandomID()] = {"id": RandomID(), "mot": $recherche, "date": getActualFullDate()};
			//console.log( JSON.stringify(json) );
			localStorage["recherche"] = JSON.stringify(json);
		}
		
		
	}
}

function affiche_historique()
{
	$no = 0;
	
	json = JSON.parse( localStorage["recherche"] );
	$(".list-recherches-recentes").html('');
	Object.keys( json ).sort(function( a,b ) {
		//return json[a].mot.localeCompare( json[b].id );
		return json[b].id - json[a].id;
	}).forEach(function( key ) {
		
		if($no <= 10)
		{
			$(".list-recherches-recentes").append('<div class="ss_search elt-recent" data-search="'+json[key].mot+'"><i class="fa fa-clock-o"></i> '+json[key].mot+'</div>');
		}
		
		$no++;
	});
	$(".list-recherches-recentes").append('<script>$(".ss_search").click(function(){$("iframe").attr("src","");test_device();$("#champ-recherche").val($(this).attr("data-search"));$("#champ-recherche-resultat").val($(this).attr("data-search"));$(".accueil-haut-recherche").css("opacity","0");$(".accueil-haut-recherche").hide();affiche_historique();$(".accueil-resultat-recherche").show();$(".accueil-resultat-recherche").css("opacity","1");$("#wait_iframe").show();$.ajax({method:"POST",url:SERVER_API+"dev/check_internet_connexion/",data:{id:"pagespro"}}).done(function(msg){if(msg=="OK"){$("#mot").val($("#champ-recherche").val());$("#pagesproForm").attr("target","page-serveur-recherche");$("#pagesproForm").attr("action",SERVER_API+"mobile/recherche/");$("#pagesproForm").submit();$("#wait_iframe").hide();$("#wait").hide()}else{localStorage.internet="0";OpenModalURL("no-connexion.html")}}).fail(function(jqXHR,textStatus,errorThrown){localStorage.internet="0";OpenModalURL("no-connexion.html")})})</script>');
	
}

/* Autocomplète du champ recherche */

var $touche = 0;
$("#champ-recherche").keyup(function(e){
	var code = (e.keyCode ? e.keyCode : e.which);

	if((code != 35) && (code != 38))
	{
		var $l = $("#champ-recherche").val();
		
		if($l.length >= 3)
		{
			$(".recherche-vide-historique").hide();
			$(".recherche-liste-autocomplete").show();
			
			/* elt 1 */
			$("#s-elt-1").html($("#champ-recherche").val());
			e1 = $("#s-elt-1").html();
			res1 = e1.replace(/\<b\>/gi, "");
			$("#s-elt-1").html(res1);

			e1 = $("#s-elt-1").html();
			cs1 = $("#champ-recherche").val()
			en1 = new RegExp(cs1, "ig");
			res1 = e1.replace(en1, "<b>"+cs1.toLowerCase()+"</b>");

			$("#s-elt-1").html(res1);
			$("#elt-1").attr("data-search", $("#champ-recherche").val());
			/* fin elt 1 */
			
			/* AJAX */
			$.ajax({
				method: "POST",
				url: "https://pagespro.cm/mobile/mobile_auto_complete_recherche",
				data: { sq: $("#champ-recherche").val(), debut: 2, total: 8 }
			})
			.done(function( msg ) 
			{
				//$('.list-recherches-trouvees').append(msg);
				resultat = msg.split("++++");
				
				if(resultat.length > 1)
				{
					/* elt 2 */
					$("#s-elt-2").html(resultat[0]);
					e2 = $("#s-elt-2").html();
					res2 = e2.replace(/\<b\>/gi, "");
					$("#s-elt-2").html(res2);

					e2 = $("#s-elt-2").html();
					cs2 = TxtAccent($("#champ-recherche").val());
					en2 = new RegExp(cs2, "ig");
					res2 = e2.replace(en2, "<b>"+cs2.toLowerCase()+"</b>");

					$("#s-elt-2").html('<i class="fa fa-search"></i> ' + LimitTXT(res2, 35));
					$("#elt-2").attr("data-search", resultat[0]);
					/* fin elt 2 */
				}
				else
				{
					$("#s-elt-2").html("");
					$("#elt-2").attr("data-search", "");
				}
				
				if(resultat.length > 2)
				{
					/* elt 3 */
					$("#s-elt-3").html(resultat[1]);
					e3 = $("#s-elt-3").html();
					res3 = e3.replace(/\<b\>/gi, "");
					$("#s-elt-3").html(res3);

					e3 = $("#s-elt-3").html();
					cs3 = TxtAccent($("#champ-recherche").val());
					en3 = new RegExp(cs3, "ig");
					res3 = e3.replace(en3, "<b>"+cs3.toLowerCase()+"</b>");

					$("#s-elt-3").html('<i class="fa fa-search"></i> ' + LimitTXT(res3, 35));
					$("#elt-3").attr("data-search", resultat[1]);
					/* fin elt 3 */
				}
				else
				{
					$("#s-elt-3").html("");
					$("#elt-3").attr("data-search", "");
				}
				
				if(resultat.length > 3)
				{
					/* elt 4 */
					$("#s-elt-4").html(resultat[2]);
					e4 = $("#s-elt-4").html();
					res4 = e4.replace(/\<b\>/gi, "");
					$("#s-elt-4").html(res4);

					e4 = $("#s-elt-4").html();
					cs4 = TxtAccent($("#champ-recherche").val());
					en4 = new RegExp(cs4, "ig");
					res4 = e4.replace(en4, "<b>"+cs4.toLowerCase()+"</b>");

					$("#s-elt-4").html('<i class="fa fa-search"></i> ' + LimitTXT(res4, 35));
					$("#elt-4").attr("data-search", resultat[2]);
					/* fin elt 4 */
				}
				else
				{
					$("#s-elt-4").html("");
					$("#elt-4").attr("data-search", "");
				}
				
				if(resultat.length > 4)
				{
					/* elt 5 */
					$("#s-elt-5").html(resultat[3]);
					e5 = $("#s-elt-5").html();
					res5 = e5.replace(/\<b\>/gi, "");
					$("#s-elt-5").html(res5);

					e5 = $("#s-elt-5").html();
					cs5 = TxtAccent($("#champ-recherche").val());
					en5 = new RegExp(cs5, "ig");
					res5 = e5.replace(en5, "<b>"+cs5.toLowerCase()+"</b>");

					$("#s-elt-5").html('<i class="fa fa-search"></i> ' + LimitTXT(res5, 35));
					$("#elt-5").attr("data-search", resultat[3]);
					/* fin elt 5 */
				}
				else
				{
					$("#s-elt-5").html("");
					$("#elt-5").attr("data-search", "");
				}
				
				if(resultat.length > 5)
				{
					/* elt 6 */
					$("#s-elt-6").html(resultat[4]);
					e6 = $("#s-elt-6").html();
					res6 = e6.replace(/\<b\>/gi, "");
					$("#s-elt-6").html(res6);

					e6 = $("#s-elt-6").html();
					cs6 = TxtAccent($("#champ-recherche").val());
					en6 = new RegExp(cs6, "ig");
					res6 = e6.replace(en6, "<b>"+cs6.toLowerCase()+"</b>");

					$("#s-elt-6").html('<i class="fa fa-search"></i> ' + LimitTXT(res6, 35));
					$("#elt-6").attr("data-search", resultat[4]);
					/* fin elt 6 */
				}
				else
				{
					$("#s-elt-6").html("");
					$("#elt-6").attr("data-search", "");
				}
				
				if(resultat.length > 6)
				{
					/* elt 7 */
					$("#s-elt-7").html(resultat[5]);
					e7 = $("#s-elt-7").html();
					res7 = e7.replace(/\<b\>/gi, "");
					$("#s-elt-7").html(res7);

					e7 = $("#s-elt-7").html();
					cs7 = TxtAccent($("#champ-recherche").val());
					en7 = new RegExp(cs7, "ig");
					res7 = e7.replace(en7, "<b>"+cs7.toLowerCase()+"</b>");

					$("#s-elt-7").html('<i class="fa fa-search"></i> ' + LimitTXT(res7, 35));
					$("#elt-7").attr("data-search", resultat[5]);
					/* fin elt 7 */
				}
				else
				{
					$("#s-elt-7").html("");
					$("#elt-7").attr("data-search", "");
				}
				
				if(resultat.length > 7)
				{	
					/* elt 8 */
					$("#s-elt-8").html(resultat[6]);
					e8 = $("#s-elt-8").html();
					res8 = e8.replace(/\<b\>/gi, "");
					$("#s-elt-8").html(res8);

					e8 = $("#s-elt-8").html();
					cs8 = TxtAccent($("#champ-recherche").val());
					en8 = new RegExp(cs8, "ig");
					res8 = e8.replace(en8, "<b>"+cs8.toLowerCase()+"</b>");

					$("#s-elt-8").html('<i class="fa fa-search"></i> ' + LimitTXT(res8, 35));
					$("#elt-8").attr("data-search", resultat[6]);
					/* fin elt 8 */
				}
				else
				{
					$("#s-elt-8").html("");
					$("#elt-8").attr("data-search", "");
				}
				
				if(resultat.length > 8)
				{
					/* elt 9 */
					$("#s-elt-9").html(resultat[7]);
					e9 = $("#s-elt-9").html();
					res9 = e9.replace(/\<b\>/gi, "");
					$("#s-elt-9").html(res9);

					e9 = $("#s-elt-9").html();
					cs9 = TxtAccent($("#champ-recherche").val());
					en9 = new RegExp(cs9, "ig");
					res9 = e9.replace(en9, "<b>"+cs9.toLowerCase()+"</b>");

					$("#s-elt-9").html('<i class="fa fa-search"></i> ' + LimitTXT(res9, 35));
					$("#elt-9").attr("data-search", resultat[7]);
					/* fin elt 9 */
				}
				else
				{
					$("#s-elt-9").html("");
					$("#elt-9").attr("data-search", "");
				}
				
				if(resultat.length > 9)
				{
					/* elt 10 */
					$("#s-elt-10").html(resultat[8]);
					e10 = $("#s-elt-10").html();
					res10 = e10.replace(/\<b\>/gi, "");
					$("#s-elt-10").html(res10);

					e10 = $("#s-elt-10").html();
					cs10 = TxtAccent($("#champ-recherche").val());
					en10 = new RegExp(cs10, "ig");
					res10 = e10.replace(en10, "<b>"+cs10.toLowerCase()+"</b>");

					$("#s-elt-10").html('<i class="fa fa-search"></i> ' + LimitTXT(res10, 35));
					$("#elt-10").attr("data-search", resultat[8]);
					/* fin elt 10 */
				}
				else
				{
					$("#s-elt-10").html("");
					$("#elt-10").attr("data-search", "");
				}
				
				//$(".bl-autocomplete-search").addClass("actived-6");

			})
			.fail(function (jqXHR, textStatus, errorThrown) 
			{ 
				//localStorage['internet'] = '0';
			});
			/* AJAX */

			
		}
		else
		{
			$re = $("#champ-recherche").val();
			$no = 1;
			
			json = JSON.parse( localStorage["recherche"] );
			$(".list-recherches-recentes").html('');
			Object.keys( json ).sort(function( a,b ) {
				//return json[a].mot.localeCompare( json[b].id );
				return json[b].id - json[a].id;
			}).forEach(function( key ) {
				
				if($no <= 10)
				{
					$(".list-recherches-recentes").append('<div class="elt-recent" data-mot="'+json[key].mot+'"><i class="fa fa-clock-o"></i> '+json[key].mot+'</div>');
				}
				
				$no++;
			});
			
			$("#s-elt-1").html("");
			$("#s-elt-2").html("");
			$("#s-elt-3").html("");
			$("#s-elt-4").html("");
			$("#s-elt-5").html("");
			$("#s-elt-6").html("");
			$("#s-elt-7").html("");
			$("#s-elt-8").html("");
			$("#s-elt-9").html("");
			$("#s-elt-10").html("");
			
			$(".recherche-liste-autocomplete").hide();
			$(".recherche-vide-historique").show();
		}
	}
	
	if(code == 13)
	{
		$("iframe").attr("src","");
		
		ajout_historique();
	
		test_device();
				
		$("#champ-recherche-resultat").val($("#champ-recherche").val());
		
		$(".accueil-haut-recherche").css("opacity","0");
		$(".accueil-haut-recherche").hide();
		
		affiche_historique();
		
		$(".accueil-resultat-recherche").show();
		$(".accueil-resultat-recherche").css("opacity","1");
		
		$("#wait_iframe").show();
		
		$.ajax({
			method: "POST",
			url: SERVER_API + "dev/check_internet_connexion/",
			data: { id: 'pagespro' }
		})
		.done(function( msg ) 
		{
			if(msg == "OK")
			{
				$("#mot").val($("#champ-recherche").val());
				$("#pagesproForm").attr("target", "page-serveur-recherche");
				$("#pagesproForm").attr("action", SERVER_API + "mobile/recherche/");
				$("#pagesproForm").submit();
				$("#wait_iframe").hide();
				$("#wait").hide();
			}
			else
			{
				localStorage['internet'] = '0';
				OpenModalURL("no-connexion.html");
			}
		})
		.fail(function (jqXHR, textStatus, errorThrown) 
		{ 
			localStorage['internet'] = '0';
			OpenModalURL("no-connexion.html");
		});
		
	}
	
});


var weather_id = "d40deaf3bab709ae";
var header = document.getElementById('city');
var wt = document.getElementById('current');

var twisted = {
    $content: $('.content'),
    $fav: $('.placeholder'),
    $form: $('form'),
    userInput: '',
    userInputIsValid: false
};

function geoFindMe() {
  var output = document.getElementById("out");

  if (!navigator.geolocation){
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    
    searchWeather(latitude,longitude);
  };

  function error() {
    output.innerHTML = "Unable to retrieve your location";
  };

  wt.innerHTML = "<p>Locating…</p>";

  navigator.geolocation.getCurrentPosition(success, error);
    
    
}

function searchWeather(latitude,longitude) {
   
    $.ajax( {
		//get data from JSON feed
		url : "http://api.wunderground.com/api/e9e6dd32bf35e0ef/geolookup/conditions/q/"+latitude+","+longitude+".json",
		dataType : "jsonp",
		success : function(parsed_json) {
			var location = parsed_json['location']['city'];
			var sampleTime = parsed_json['current_observation']['local_time_rfc822'];
			var tempString = parsed_json['current_observation']['temp_f'];
			var feelsLikeF = parsed_json['current_observation']['feelslike_f'];
			var weather = parsed_json['current_observation']['weather'];
			var precipTodayString = parsed_json['current_observation']['precip_today_string'];
			var windStr = parsed_json['current_observation']['wind_string'];
			var icon = parsed_json['current_observation']['icon_url'];
						
            $(".wrapper").show();
            header.innerHTML = "<h2><strong>"+location+"</strong></h2>";
            wt.innerHTML = "<div class='main'><img src='"+icon+"'>"
                         + "<hr>"
                         + "<div class='temp'>"+tempString+"&deg;</div>"
                         + "<div class='feels'>Feels like "+feelsLikeF+"&deg;</div></div>";
            			
		}
	});
}

function queue(url) {
       
    $.ajax({
        url:      "http://autocomplete.wunderground.com/aq",
        dataType: "jsonp",
        jsonp:    "cb",     // <================= New bit is here
        data:     {
            format: "json",
            query:  url
        },
        success:  function (data) {
            
            var lat = data.RESULTS[0].lat;
            var long = data.RESULTS[0].lon;
            console.log("long: "+long);
            console.log("lat: "+lat);
            
            searchWeather(lat,long);
            
        }
    });
}

$(document).ready(function () {
    
    geoFindMe();
    
    $(".wrapper").hide();

    twisted.$form.keyup(function (e) {
        
        if(!this.value){
            geoFindMe();
        }
        
        e.preventDefault();
        twisted.userInput = $(this).find('input').val();
        var url = twisted.userInput.replace(/ /g, "+");
         
        queue(url);
                
    });
});
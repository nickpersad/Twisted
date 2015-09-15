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
		url : "http://api.wunderground.com/api/e9e6dd32bf35e0ef/geolookup/conditions/q/"+latitude+","+longitude+".json", //TODO switch back in my API Key
		dataType : "jsonp",
		success : function(parsed_json) {
			var location = parsed_json['location']['city'];
			var sampleTime = parsed_json['current_observation']['local_time_rfc822'];
			var tempString = parsed_json['current_observation']['temp_f'];
			var feelsLikeF = parsed_json['current_observation']['feelslike_f'];
			var weather = parsed_json['current_observation']['weather'];
			var precipTodayString = parsed_json['current_observation']['precip_today_string'];
			var icon_url = parsed_json['current_observation']['icon_url'];
			var icon = parsed_json['current_observation']['icon'];
            var sym;
            
            //Symbols depending on day or night and weather
            var current= new Date()
            var day_night=current.getHours()
            if (day_night<=12 && icon === "clear")
                sym = "<i class='fa fa-moon-o'></i>";
            else if (icon === "clear"){
                sym = "<i class='fa fa-sun-o'></i>";
            } else if (icon === "cloudy"){
                sym = "<i class='fa fa-cloud'></i>";
            } else if (icon === "tstorms"){
                sym = "<i class='fa fa-bolt'></i>";
            } else {
                sym = "<img src='"+icon_url+"'>";
            }
						
            $(".wrapper").show();
            header.innerHTML = "<h2><strong>"+location+"</strong></h2>";
            wt.innerHTML = "<div class='main'>" + sym
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
        jsonp:    "cb",
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
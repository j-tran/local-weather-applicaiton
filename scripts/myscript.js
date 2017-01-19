//ip -> lat/lon -> weather
var latitude;
var longitude;
var windSpeedUnit = " miles/hr";
var temperatureUnit = " °F";
var temperature;
var conditions;
var position;
var imageID;
var windspeed;
var html;
var farenheit = true;
var created = false; //Used so that if we change temperature scale won't automatically generate
var link;
var ip;



$(document).ready(function() {
   $("#generator-btn").on("click", function() {
      main();
   });

   $("#change-temperature-btn").on("click", changeTemperature);
});

function main() {
   $("#forecast").html("<i class=\"fa fa-spinner fa-spin\" style=\"font-size: 300%\"></i>");
   $.getJSON("https://api.ipify.org/?format=json", function(json) {
      ip = json.ip;
      $.getJSON("https://freegeoip.net/json/76.21.124.50", function(json) {
         latitude = json.latitude;
         longitude = json.longitude;
         link = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(SELECT%20woeid%20FROM%20geo.places%20WHERE%20text%3D%22(" + latitude + "%2C+" + longitude + ")%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
         generateWeather(); //needs to be in here to adjust for AJAX
      });
   });
}

function changeTemperature() {
   if (farenheit) {
      convertMetric();
      temperatureUnit = " °C";
      windSpeedUnit = " meters/sec";
      farenheit = false;
      $("#change-temperature-btn").text(temperatureUnit);
   }
   else {
      main();
      temperatureUnit = " °F";
      windSpeedUnit = " miles/hr";
      farenheit = true;
      $("#change-temperature-btn").text(temperatureUnit);
   }
   if (created) {
      html = "<i class=\"wi wi-yahoo-" + imageID + " icon\"></i>" + "<p>" + "<span class=\"categories\">Location:    </span>" + position + " <span class=\"categories\">" + "Windspeed:    </span>" + windspeed + windSpeedUnit + "</p><br/><p>" + "<span class=\"categories\">Temperature:    </span>" + temperature + temperatureUnit + " <span class=\"categories\">Conditions:</span> " + conditions + "</p>";
      $("#forecast").html(html);
   }
}

function convertMetric() {
   temperature = Math.round(temperature - 32 * (5 / 9));
   windspeed = Math.round(windspeed * 2.2369362920544);
}

function generateWeather() {
   timer();
   $.getJSON(link, function(json) {
      created = true;
      temperature = json.query.results.channel.item.condition.temp;
      conditions = json.query.results.channel.item.condition.text;
      imageID = json.query.results.channel.item.condition.code;
      position = json.query.results.channel.location.city;
      windspeed = json.query.results.channel.wind.speed;
      if (!farenheit) {
         convertMetric();
      }
      html = "<i class=\"wi wi-yahoo-" + imageID + " icon\"></i>" + "<p>" + "<span class=\"categories\">Location:    </span>" + position + " <span class=\"categories\">" + "Windspeed:    </span>" + windspeed + windSpeedUnit + "</p><br/><p>" + "<span class=\"categories\">Temperature:    </span>" + temperature + temperatureUnit + " <span class=\"categories\">Conditions:</span> " + conditions + "</p>";
      $("#forecast").html(html);
      colorChange();
   });
}

//called after $("#forecast").html(html);
function colorChange() {
   if ((temperature > 85 && farenheit) || (temperature > 29.4444 && !farenheit)) {
      $("button").fadeTo(500, 0);
      $("h1").fadeTo(500, 0, function() {
         $("h1").html("It's pretty hot").css("color", "#ff4d4d");
         $("button").css("background-color", "#ff4d4d");
         $("body").css("background-color", "#ff4d4d");
         $("button").css("background-color", "#ff4d4d");
         $("h1").fadeTo(500, 1);
         $("button").fadeTo(500, 1);
      });
   }
   else if ((temperature > 60 && farenheit) || (temperature > 15.5556 && !farenheit)) {
      $("button").fadeTo(500, 0);
      $("h1").fadeTo(500, 0, function() {
         $("h1").html("Fair weather today").css("color", "#30854A");
         $("button").css("background-color", "#30854A");
         $("body").css("background-color", "#30854A");
         $("button").css("background-color", "#30854A");
         $("h1").fadeTo(500, 1);
         $("button").fadeTo(500, 1);
      });
   }
   else {
      $("button").fadeTo(500, 0);
      $("h1").fadeTo(500, 0, function() {
         $("h1").html("It's pretty cold").css("color", "#6699FF");
         $("button").css("background-color", "#6699FF");
         $("body").css("background-color", "#6699FF");
         $("button").css("background-color", "#6699FF");
         $("h1").fadeTo(500, 1);
         $("button").fadeTo(500, 1);
      });
   }
}



//Used to detect if API request doesn't work after 4 seconds. Activates in the generateWeather() function
function timer() {
   setTimeout(function() {
      if (!created) {
         // Handle error accordingly
         alert("Browser doesn't support location. Try again one more time.");
      }
   }, 4000);
}

var searchBtn = $("#searchButton");
var clearBtn = $("#clearButton");
var cityInput = $("#city-input");

var currentCity = $("#displayCity");
var currentDate = $("#displayDate");
var currentTemp = $("#displayTemp");
var currentHumid = $("#displayHumid");
var currentWind = $("#displayWindSpeed");
var currentUv = $("#displayUV");

var fiveDayDisplay = $("#cityContainer");

var cities = [];
// var cityName = "Walnut";

console.log("hello world, your JS file is indeed linked")

var myAPIkey = "24fe8871da5ed11f29fa9e178307404d";


searchBtn.on("click", function(){
  event.preventDefault();
  var newCity = $("#city-input").val().trim()
  cities.push(newCity);
  // console.log(cities); // display array

  var queryUrl1 = "https://api.openweathermap.org/data/2.5/weather?q=" + newCity + "&appid=" + myAPIkey;

  $.ajax({
    url: queryUrl1,
    method: "GET"
  }).then(function(info) {
    // console.log(info) // display object
    var latitude = info.coord.lat;
    var longitude = info.coord.lon;
    var queryUrl2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=current,minutely,hourly,alerts&units=imperial&appid=" + myAPIkey;

    $.ajax({
      url: queryUrl2,
      method: "GET"
    }).then(function(data) {
        console.log(data) // display object
        currentCity.text(newCity)
        currentDate.text(moment.unix(data.daily[0].dt).format('MM/DD/YYYY'))
        currentTemp.text(data.daily[0].temp.day)
        currentHumid.text(data.daily[0].humidity)
        currentWind.text(data.daily[0].wind_speed)
        currentUv.text(data.daily[0].uvi)
        // console.log(day)
        fiveDayDisplay.empty();
        
        for (var day=1; day < 6; day++){

          var firstDiv = $("<div>").addClass("card mx-2 my-2 btn-primary rounded active").attr("style", "width:13rem");
          var secondDiv = $("<div>").addClass("card-body");
          var dateEl = $("<h5>").addClass("card-title").text(moment.unix(data.daily[day].dt).format('MM/DD/YYYY'));
          var tempEl = $("<p>").addClass("card-text").html("Temp: " + data.daily[day].temp.day + "(&#176;F)");
          var humidEl = $("<p>").addClass("card-text").text("Humidity: " + data.daily[day].humidity + "%");

          secondDiv.append(dateEl, tempEl, humidEl);
          firstDiv.append(secondDiv);
          fiveDayDisplay.append(firstDiv);

        }

        // console.log(day.list[1].dt_txt);
        // console.log(moment.unix(day.list[0].dt)/1000 + "unix format")
        // var dayFar = (((day.list[0].main.temp)-273.15)*(9/5)+32).toFixed(2);
        // console.log("Temp: " + dayFar)
        
        // var humidity = (day.list[0].main.humidity)
        // console.log("Humidity: " + humidity + "%")
        // var unixUtcObj = moment.unix(1606676400).utc();
        // console.log(unixUtcObj.format('MM DD YYYY'))
          
    });
});
})

clearBtn.on("click", function(){
  event.preventDefault();
  cities = [];
  // console.log(cities); // display array
})




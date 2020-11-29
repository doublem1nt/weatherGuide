// Variables grabbing Input, Submit & Clear Elements
var searchBtn = $("#searchButton");
var clearBtn = $("#clearButton");
var cityInput = $("#city-input");

// Variables to dynamically edit main city display elements
var currentCity = $("#displayCity");
var currentDate = $("#displayDate");
var currentTemp = $("#displayTemp");
var currentHumid = $("#displayHumid");
var currentWind = $("#displayWindSpeed");
var currentUv = $("#displayUV");

// Variables for 2x primary section containers, (1) 5 day forecast & (2) sidebar city-search history 
var fiveDayDisplay = $("#cityContainer");
var citiesLegend = $("#city-list");

// Variable to pull data from persisted local storage and prepares for it to be displayed upon initial user input
var cityHistory = JSON.parse(localStorage.getItem("allHistory")) || []

// Empty Variables, waiting for user input
var cities = [];
var newCity = "";

// https://openweathermap.org/ ---- API KEY
var myAPIkey = "24fe8871da5ed11f29fa9e178307404d";

// Search Button on Click Functionality
searchBtn.on("click", function(event){
  event.preventDefault();

  // pulls city from User Input
  newCity = $("#city-input").val().trim()

  // adds city into local array
  cities.unshift(newCity);

  // updates local storage with new local array information
  localStorage.setItem("allHistory", JSON.stringify(cities));

  // clears history side bar before repopuplating it with updated array info
  citiesLegend.empty();
  searchHistory();

  // function displays user's most recent inputted city
  displayMain();
})

// Clear button on click functionality 
clearBtn.on("click", function(event){
  event.preventDefault();

  // clears local array, local storage and removes all 5 day forecast & side bar information
  cities = [];
  localStorage.clear();
  fiveDayDisplay.empty();
  citiesLegend.empty();
})

// function defines what happens if user clicks on a sidebar element from Search History
function cityHistorySelect(){
  var historyCity = $(this).attr("city-name");

  // reassigns city-name data attribute and displays it to the main view
  newCity = historyCity;
  displayMain();

}

// Function Definition to populate main view display with AJAX object information
function displayMain(){

  // first ajax call used to pull data related to specific city
  var queryUrl1 = "https://api.openweathermap.org/data/2.5/weather?q=" + newCity + "&appid=" + myAPIkey;
  $.ajax({
    url: queryUrl1,
    method: "GET"
  }).then(function(info) {

    // extracts longitude and latitude values from object
    var latitude = info.coord.lat;
    var longitude = info.coord.lon;

    // second Ajax call, longitude & latitude variables specify city forecast for next 5 days
    var queryUrl2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=current,minutely,hourly,alerts&units=imperial&appid=" + myAPIkey;
    $.ajax({
      url: queryUrl2,
      method: "GET"
    }).then(function(data) {

        // variables to display information in main view display
        var iconUrl = "http://openweathermap.org/img/wn/" + data.daily[0].weather[0].icon + ".png";
        var weatherIcon = $("<img>").attr("src", iconUrl);
        var currentDay = data.daily[0];

        // dynamically modifies existing HTML for main view display of current city selected / inputed 
        currentCity.text(newCity)
        currentCity.append(weatherIcon);
        currentDate.text(moment.unix(data.daily[0].dt).format('MM/DD/YYYY'))
        currentTemp.text(currentDay.temp.day)
        currentHumid.text(currentDay.humidity)
        currentWind.text(currentDay.wind_speed)
        currentUv.html();

        // changes the color of the UV index based on the number
        // red bad, blue good. 
        if (currentDay.uvi < 3){
          currentUv.text(currentDay.uvi).addClass("bg-primary font-weight-bolder").attr("style", "color:white")
        } else if(currentDay.uvi > 2 && currentDay.uvi < 6){
            currentUv.text(currentDay.uvi).addClass("bg-info font-weight-bolder").attr("style", "color:white")  
          } else if(currentDay.uvi > 5 && currentDay.uvi < 8){
            currentUv.text(currentDay.uvi).addClass("bg-secondary font-weight-bolder").attr("style", "color:white")
          } else {
            currentUv.text(currentDay.uvi).addClass("bg-danger font-weight-bolder").attr("style", "color:white")
            }
      
        // Prior to populating 5 day forecast display, below empties all previous
        fiveDayDisplay.empty();
        
        // For Loop displays next five days of weather
        for (var day=1; day < 6; day++){
          
          // new elements & design
          var iconUrl = "http://openweathermap.org/img/wn/" + data.daily[0].weather[0].icon + ".png";
          var weatherIcon = $("<img>").attr("src", iconUrl);
          var firstDiv = $("<div>").addClass("card mx-2 my-2 btn-primary rounded active").attr("style", "width:13rem");
          var secondDiv = $("<div>").addClass("card-body");
          var dateEl = $("<h5>").addClass("card-title").text(moment.unix(data.daily[day].dt).format('MM/DD/YYYY'));
          var tempEl = $("<p>").addClass("card-text").html("Temp: " + data.daily[day].temp.day + "(&#176;F)");
          var humidEl = $("<p>").addClass("card-text").text("Humidity: " + data.daily[day].humidity + "%");

          // appends all dynmically built elements for 5 day forecast display
          secondDiv.append(dateEl, tempEl, humidEl);
          firstDiv.append(secondDiv);
          dateEl.append(weatherIcon);
          fiveDayDisplay.append(firstDiv);

        }         
    });
});
}

// function grabs any previously saved local storage and builds it into the side bar search history
function frontLoad() {
  if (cityHistory !== []){
  cities = cityHistory;
  searchHistory();
  }
}

// function dynamically creates new search history elements for user to click on if he/she wishes to refer back to previous cities
function searchHistory(){
  for (var i = 0; i < cities.length; i++){
    
    var liEl = $("<li>").attr("city-name", cities[i]).addClass("citySidebar");
    var div1El = $("<div>").addClass("card mx-1")
    var div2El = $("<div>").addClass("card-body")
    var spanEl = $("<span>").addClass("card-title").text(cities[i])

    div2El.append(spanEl);
    div1El.append(div2El);
    liEl.append(div1El);
    citiesLegend.append(liEl);
}}

// calls local storage data to be loaded
frontLoad();

// sets up Click action on any side bar search history elements 
$(document).on("click", ".citySidebar", cityHistorySelect);
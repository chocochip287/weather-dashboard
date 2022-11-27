/* 11/26/2022
- dates from the 5-day API need to be converted from Unix to human-readable if using the dt key. otherwise, use the dt_txt key.
- figure out locally storing an array and a way to clear it.
*/

// OpenWeather 5-day API key
var myKey = '69408b91f433def6af6c538d44d5e090'

// global variables

var city = "";
var geocodingUrl = "";

// variable to ID the search textarea

var searchedCity = document.getElementById('searchedCity');

// variable to ID the search button

var searchButton = document.getElementById('searchButton');

// event listener to set the searched value as the city variable

searchButton.addEventListener('click', setCity);

// variable to hold the geocode results

var geocodeResults = JSON.parse(localStorage.getItem('geocodeResults')) || [];

// variable to hold the 5-day results

var fiveDay = 'bbb' || [];

// 5DayUrl = api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&units=imperial&appid={API key}

// need a function to create an object containing the searched city name and its lat and lon to plug into the 5DayUrl
// Array.unshift will add an object to the array's first position.

function setCity() {
    // sets the city variable based on the user's search
    if (searchedCity.value) {
    city = searchedCity.value.trim();
    // gets geocode data for the searched city
    geocodeApi();
    } else {
        searchedCity.setAttribute('placeholder', "Please provide a city to check!");
    }
}

function geocodeApi() {
    geocodingUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + myKey;
    // queries the geocode API to obtain latitude and longitude for a searched city
    fetch(geocodingUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (geocodeData) {
            // we need to figure out how to store the results of each search so that we can access them again later.
            localStorage.setItem('geocodeResults', JSON.stringify(geocodeData));
            geocodeResults.unshift(JSON.parse(localStorage.getItem('geocodeResults')));
        })
}

localStorage.clear()
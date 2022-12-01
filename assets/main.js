/* 11/26/2022
- dates from the 5-day API need to be converted from Unix to human-readable if using the dt key. otherwise, use the dt_txt key.
- figure out locally storing an array and a way to clear it.
*/

// OpenWeather 5-day API key
var myKey = '69408b91f433def6af6c538d44d5e090'

// global variables

// becomes the currently searched city for the API functions
var city = "";
// placeholder for the geocode API URL
var geocodingUrl = "";
// placeholder for the current city's geocode data for accessing lat and lon
var geocodedCity;
// placeholder for the current city's lat
var geocodedCityLat;
// placeholder for the current city's lon
var geocodedCityLon;
// placeholder for the 5-day API URL
var fiveDayURL;

// variable to ID the search textarea

var searchedCity = document.getElementById('searchedCity');

// variable to ID the search button

var searchButton = document.getElementById('searchButton');

// event listener to set the searched value as the city variable

searchButton.addEventListener('click', setCity);

// variable to store searched cities

var cities = [] || localStorage.setItem('cities', JSON.stringify(cities));

// variable to hold the 5-day results

var fiveDay = 'bbb' || [];

// Array.unshift will add an object to the array's first position.

// function to set the city value required for the geocode API
function setCity() {
    // sets the city variable based on the user's search
    if (searchedCity.value) {
    city = searchedCity.value.trim();
    cities.push(city);
    localStorage.setItem('cities', JSON.stringify(cities));
    // gets geocode data for the searched city
    geocodeApi();
    } else {
        searchedCity.setAttribute('placeholder', "Please provide a city to check!");
    }
}

function geocodeApi() {
    geocodingUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + myKey;
    // queries the geocode API to obtain latitude and longitude for a searched city
    fetch(geocodingUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (geocodeData) {
            // we need to figure out how to store the results of each search so that we can access them again later.
            localStorage.setItem('geocodeResults', JSON.stringify(geocodeData));
            // sets the global variable for the current city
            geocodedCity = JSON.parse(localStorage.getItem('geocodeResults'));
            // sets the lat and lon for the current city with two decimal places
            geocodedCityLat = geocodedCity[0].lat.toFixed(2);
            geocodedCityLon = geocodedCity[0].lon.toFixed(2);
        })
}

// function to query the 5-day API using the lat and lon values from the geocode API

function fiveDayApi() {
    fiveDayURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + geocodedCityLat + '&lon=' + geocodedCityLon + '&units=imperial&appid=' + myKey;
}

// function to set a button under the search bar for previously searched cities - include a clear all button if cities.length > 0

// function to render weather data for the current city

// pageload function to render cities buttons if anything exists in its localstorage container
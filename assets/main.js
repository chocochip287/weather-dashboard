/* 12/3/2022
- nothing for now. MVP achieved

POST-MVP CONSIDERATIONS
------
- add a check to ensure that cities are searched in uniform format regardless of input (e.g., first letter of each word capitalized) and not added to the cities array if they already exist.
- set up more thorough date checking - the data returned from the five day API is relative to the time of day for the user (e.g., searching Tokyo and Philadelphia at roughly 11:30 EST on 12/3, both sets of results had 12/3 at 18:00 even though it was roughly 01:30 JST on 12/4 in Tokyo at the time
- expand clear functionality to return the results panel to the start and clear the previously searched buttons
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
// today's date using moment
var todaysDate = moment().format('MM/DD/YYYY');

// placeholder for the current city's 5-day data - uses localStorage item if available
if (localStorage.getItem('fiveDayResults') === null) {
    var cityFiveDay = [];
} else {
    var cityFiveDay = JSON.parse(localStorage.getItem('fiveDayResults'));
}

// defines the cities variable based on whether or not any cities existed in localStorage

if (localStorage.getItem('cities') === null) {
    var cities = [];
} else {
    var cities = JSON.parse(localStorage.getItem('cities'));
}

// document variables

// variable for the search history area
var searchArea = document.getElementById('searchHistory');

// variable for the clear search history button
var searchClearButton = document.getElementById('clearButton');
searchClearButton.addEventListener('click', byebyeData);

// variable to ID the search textarea

var searchedCity = document.getElementById('searchedCity');

// variable to ID the search button

var searchButton = document.getElementById('searchButton');

// event listener to set the searched value as the city variable

searchButton.addEventListener('click', setCity);

// variable to capture the five day divs

var fiveDayDivs = document.getElementById('fiveDay');

// variable to target the currentCity div

var currentCity = document.getElementById('currentCity');

// functionality variables

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
            fiveDayApi();
        })
}

// function to query the 5-day API using the lat and lon values from the geocode API

function fiveDayApi() {
    fiveDayURL = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + geocodedCityLat + '&lon=' + geocodedCityLon + '&units=imperial&appid=' + myKey;
    fetch(fiveDayURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (fiveDayData) {
        // we need to figure out how to store the results of each search so that we can access them again later.
        localStorage.setItem('fiveDayResults', JSON.stringify(fiveDayData));
        // sets the global variable for the current city
        cityFiveDay = JSON.parse(localStorage.getItem('fiveDayResults'));

        searchUpdate();
        renderWeatherData();
    })
}

// function to set a button under the search bar for previously searched cities and unhide the search clear button on page load if cities exist in storage

if (cities.length > 0) {
    searchClearButton.removeAttribute('class', 'hide-me');
    searchUpdate();
}

// function to modify the search area with any cities in the cities array

function searchUpdate() {
    for (var i=0; i < cities.length; i++) { 
        searchClearButton.removeAttribute('class', 'hide-me');
        // appends buttons for each item in the cities array into the search history field
        var makeButton = document.createElement('button');
        // creates a new button
        if (searchArea.children.length < cities.length) {
        searchArea.appendChild(makeButton);
        }
        searchArea.children[i].textContent = cities[i];
        searchArea.children[i].setAttribute('class', 'searchedCities');
        searchArea.children[i].addEventListener('click', modifyCity);
    }
}

// function to update the city variable from a search history button and call the APIs again

function modifyCity(event) {
    for (var i=0; i < searchArea.children.length; i++) {
        // ignores search history buttons that aren't targeted
        if (event.target !== searchArea.children[i]) {
            continue
        }
        // updates the city variable to match the text content of the button and repeats the fetch and render functions
        city = searchArea.children[i].textContent;
        geocodeApi();
    }
}

// function to render weather data for the current city

function renderWeatherData() {
    // "unveils" the weather panel and sets the current city
    currentCity.removeAttribute('class', 'hide-me');
    document.getElementById('currentCityName').textContent = city;

    // sets values for today
    document.getElementById('todaysDate').textContent = todaysDate;
    document.getElementById('tempToday').textContent = 'Temp: ' + cityFiveDay.list[0].main.feels_like + '°F';
    document.getElementById('windToday').textContent = 'Wind: ' + cityFiveDay.list[0].wind.speed + 'mph';
    document.getElementById('humidityToday').textContent = 'Humidity: ' + cityFiveDay.list[0].main.humidity + '%';

    // loops to set values for the five day run
    var plusDivs = document.getElementsByClassName('plusDivs');
    // loop for dates
    var plusDivDates = document.getElementsByClassName('plusDivDates');
    for (var i=0; i < plusDivs.length; i++) {
        plusDivDates[i].innerHTML = moment().add(i+1, 'days').format('MM-DD-YYYY')
    }

    // loop for temperature
    var plusDivTemps = document.getElementsByClassName('plusDivTemps');
    var j = 6;
    for (var i = 0; i < plusDivTemps.length; i++) {
        plusDivTemps[i].innerHTML = 'Temp: ' + cityFiveDay.list[j].main.feels_like + '°F';
        j += 6;
    }   

    // loop for wind
    var plusDivWinds = document.getElementsByClassName('plusDivWinds');
    var k = 6;
    for (var i = 0; i < plusDivWinds.length; i++) {
        plusDivWinds[i].innerHTML = 'Wind: ' + cityFiveDay.list[k].wind.speed + ' mph';
        k += 6;
    }

    // loop for humidity
    var plusDivHum = document.getElementsByClassName('plusDivHum');
    var l = 6;
    for (var i = 0; i < plusDivWinds.length; i++) {
        plusDivHum[i].innerHTML = 'Humidity: ' + cityFiveDay.list[l].main.humidity + '%';
        l += 6;
    }
}

// function to clear local storage

function byebyeData() {
    localStorage.clear();
    document.getElementById('clearText').textContent = 'Past search data cleared. Your slate will be blank on refresh.'
}
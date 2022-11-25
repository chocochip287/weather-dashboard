/* 11/23/2022
- o hey great to be here
*/

// OpenWeather 5-day API key
var myKey = '69408b91f433def6af6c538d44d5e090'

// geocodingUrl = http://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={API key}
// 5DayUrl = api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

// need a function to create an object containing the searched city name and its lat and lon to plug into the 5DayUrl
// Array.unshift will add an object to the array's first position.
import ajax from 'jquery';

export const FETCH_WEATHER_FROM_OPENWEATHER = 'FETCH_WEATHER_FROM_OPENWEATHER';
export const FETCH_WEATHER_UPDATE = 'FETCH_WEATHER_UPDATE';

const API_KEY = 'df53338709b54a2247c6e16358430a33';
const WEATHER_URL = `http://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric`;

let numberOfRequests = 0;
let listOfCities = [];

// In weather-list > componentWillReceiveProps, the initial run requests an
// update for each city that has weather that was requested more than 30
// minutes ago. If there is more than once city to update, once one city is
// updated and componentWillReceiveProps runs, it will request another update
// for the remaining cities that are still out of date. listOfCities keeps
// track of what cities have had an update requested and ignores duplicate
// requests.
function manageRequestVolume(url, cityId) {
    if (numberOfRequests > 10) {
        alert("Sorry, too many requests... take a break!");
        return;
    }
    if (listOfCities.indexOf(cityId) === -1) {
        listOfCities = [...listOfCities, cityId]
        numberOfRequests++;
        return ajax.get(url);
    }
}


export function fetchWeatherFromOpenWeather(cityId = '5043779') {
    const url = `${WEATHER_URL}&id=${cityId}`;
    const request = manageRequestVolume(url, cityId);
    return {
        type: FETCH_WEATHER_FROM_OPENWEATHER,
        payload: request
    }
}

export function fetchWeatherUpdate(cityId) {
    const url = `${WEATHER_URL}&id=${cityId}`;
    const request = manageRequestVolume(url, cityId);

    return {
        type: FETCH_WEATHER_UPDATE,
        payload: request
    }
}
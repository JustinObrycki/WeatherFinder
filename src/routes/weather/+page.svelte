


<style>
  .screen {
    min-height: 100%;
    display: grid;
    grid-template:
    "header header header" 30%
    "search search search" 20%
    "weather-header weather-header weather-header" 60%
    ;
    justify-items: center;
    align-items: center;
  }
  .header {
    grid-area: header;
  }

  weather-header {
    grid-area: weather-header;
    max-width: 80%;
    width: 70%;
    max-height: 80%;
    margin-top: -150px;
    overflow-x: auto; 
    overflow-y: hidden; 
    border-top: 1px solid #ccc;
    padding: 20px;  
    display: flex; 
    flex-wrap: nowrap;
    align-items: center; 
    text-align: center;
    scroll-snap-type: x mandatory;
    
  }

  weather-card:hover{ 
    background-color: #eaeaea;
    cursor: pointer;
  }

  weather-header::-webkit-scrollbar {
     display: none;
  }

  weather-card {
    display: grid;
    grid-template:
    "Image"
    "Forecast"
    "Temp"
    "Location"
    "delete"
    ;
    flex: 0 0 auto;
    border: 3px solid black;
    border-radius: 10%;
    padding: 2%;
    width: 250px; 
    height: 300px; 
    margin-right: 20px;
    scroll-snap-align: start;

  }


  .search-form {
    margin-top: 20px;
    justify-items: center;
    align-content: center;
    grid-area: search;
    margin-left: 10%;
    padding: 1rem;
  }
  .search-form [type="text"] {
    margin-right: 10px;
    justify-items: center;
    align-content: center;
    height: 35px;
  }

</style>

<div class="screen">
  <div class="header">
    <img src='/Background.png' alt="Background Image">
  </div>
  <div class="search-form">
    <input id="cityName" type="text"
           placeholder="Enter City Name."
           bind:value={$cityName}
    />
    <ion-button style="margin-top: -6px" type="button"
      on:click={() => addWeatherInfo($cityName)}
    >ADD</ion-button>
  </div>
  <weather-header>
    {#each $weatherList as weather}
    <weather-card>
        <div class="Image">
          <img src={`http://openweathermap.org/img/wn/${weather.icon}.png`} alt="Weather Icon">
        </div>
        <div class="Temp">
          {weather.temperature}°F
        </div>
        <div class="Forecast">
          {weather.forecast}
        </div>
        <div class="Location">
          {weather.cityName}, {weather.stateName}
        </div> 
        <button class=delete on:click={() => deleteLocation(weather.cityName)}>
          remove
        </button>
    </weather-card>
    {/each}
  </weather-header>
</div>





<script lang="ts">

class Location {
    icon: string;
    forecast: string;
    temperature: number;
    cityName: string;
    stateName: string;

    constructor(icon: string, forecast: string, temperature: number, cityName: string, stateName: string) {
      this.icon = icon;
      this.forecast = forecast;
      this.temperature = temperature;
      this.cityName = cityName;
      this.stateName = stateName;
    }
  }

import { writable } from 'svelte/store';
import { onMount } from 'svelte';


const apiKey = '3103eb4c0aabe818936e99845a7aaeed';
let cityName = writable('');
let currentWeather = writable(null);
let temperatureFahrenheit = writable(null);
let icon = writable('');
let stateName = writable('');
let weatherList = writable([]) 

async function addWeatherInfo(inputcityName) {
  const cityResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${inputcityName}&limit=5&appid=${apiKey}`);
  if (!cityResponse.ok) {
    alert('Failed to fetch city coordinates.');
    return;
  }
  
  const locations = await cityResponse.json();
  const [firstLocation] = locations;
  if (!firstLocation) {
    console.log('No locations found for the specified city name.');
    return;
  }
  
  const { lat, lon, state, country, name: standardizedCityName} = firstLocation;

  const duplicate = $weatherList.some(location => location.cityName.toLowerCase() === standardizedCityName.toLowerCase());

  if (duplicate) {
    alert(`${standardizedCityName} is already added.`);
    return;
  }
  
  const weatherResponse = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`);
  if (!weatherResponse.ok) {
    console.error('Failed to fetch weather data');
    return;
  }

  const { current } = await weatherResponse.json();
  const { weather: [{ description, icon: weatherIcon }], temp } = current;
  currentWeather.set(description);
  icon.set(weatherIcon);
  temperatureFahrenheit.set(((9 / 5) * (temp - 273.15) + 32).toFixed(0));
  stateName.set(state || country);
  cityName.set(standardizedCityName);

  const currentCityName = $cityName;
  const currentWeatherValue = $currentWeather;
  const currentTemperature = $temperatureFahrenheit;
  const currentIcon = $icon;
  const currentStateName = $stateName;

  let newLocation = new Location(currentIcon, currentWeatherValue, currentTemperature, currentCityName, currentStateName);
  weatherList.update(list => [...list, newLocation]); 
  save()
}


async function updateWeatherInfo(inputcityName) {
  const cityResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${inputcityName}&limit=5&appid=${apiKey}`);
  if (!cityResponse.ok) {
    alert('Failed to fetch city coordinates.');
    return;
  }
  
  const locations = await cityResponse.json();
  const [firstLocation] = locations;
  if (!firstLocation) {
    console.log('No locations found for the specified city name.');
    return;
  }
  
  const { lat, lon, state, country, name: standardizedCityName} = firstLocation;
  
  const weatherResponse = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`);
  if (!weatherResponse.ok) {
    console.error('Failed to fetch weather data');
    return;
  }

  const { current } = await weatherResponse.json();
  const { weather: [{ description, icon: weatherIcon }], temp } = current;
  currentWeather.set(description);
  icon.set(weatherIcon);
  temperatureFahrenheit.set(((9 / 5) * (temp - 273.15) + 32).toFixed(0));
  stateName.set(state || country);
  cityName.set(standardizedCityName);

  const currentCityName = $cityName;
  const currentWeatherValue = $currentWeather;
  const currentTemperature = $temperatureFahrenheit;
  const currentIcon = $icon;
  const currentStateName = $stateName;

  let newLocation = new Location(currentIcon, currentWeatherValue, currentTemperature, currentCityName, currentStateName);
  weatherList.update(currentList => {
  // Check if the location already exists in the list
  const existingIndex = currentList.findIndex(location => location.cityName === currentCityName && location.stateName === currentStateName);
  
  if (existingIndex !== -1) {
    // If it exists, replace the existing location with the new one
    currentList[existingIndex] = newLocation;
  } else {
    // If it doesn't exist, add the new location to the list
    currentList.push(newLocation);
  }

  return currentList;
}); 
  save()
}


let save = function(){
  localStorage.setItem('Weather_List', JSON.stringify($weatherList))
}

let deleteLocation = function(cityName){
  weatherList.update(currentList => {
    return currentList.filter(location => location.cityName !== cityName);
  });
  save(); 

}



onMount(() => { 
  $weatherList = JSON.parse(localStorage.getItem('Weather_List')) || []
  $weatherList.forEach((city) => {
    console.log("Updating cities")
    updateWeatherInfo(city.cityName)
    console.log("Finished")
  })
})
</script>   


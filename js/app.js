import { fetchWeather, fetchWeatherByCoordinates } from './weatherApi.js';

class WeatherApp {
    constructor() {
        this.searchBtn = document.getElementById('search-btn');
        this.cityInput = document.getElementById('city-input');
        this.weatherContainer = document.getElementById('weather-container');
        this.historyList = document.getElementById('history-list');
        this.geoBtn = document.getElementById('geo-btn'); // Button for geolocation
        this.searchHistory = [];

        this.init();
    }

    init() {
        // Add event listeners
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.geoBtn.addEventListener('click', () => this.handleGeolocation());
        const urlParams = new URLSearchParams(window.location.search);
        const city = urlParams.get('city');
        if (city) {
            this.handleSearch(city);
        }
        this.loadHistoryFromLocalStorage(); // Load history on initialization
        this.historyList.addEventListener('click', (e) => this.handleHistoryClick(e));
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
    }

    handleSearch(cityFromHistory = null) {
        const city = cityFromHistory || this.cityInput.value;
        if (city) {
            fetchWeather(city).then(data => {
                if (data.cod === '404') {
                    this.displayError(data.message);
                } else {
                    this.displayWeather(data);
                    this.addToHistory(city);
                    this.updateURL(city);
                }
            }).catch(error => {
                this.displayError('Unable to fetch weather data. Please try again later.');
                console.error('Error fetching weather data:', error);
            });
        } else {
            this.displayError('Please enter a city name.');
        }
    }

    handleGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByCoordinates(latitude, longitude).then(data => {
                        if (data.cod === '404') {
                            this.displayError(data.message);
                        } else {
                            this.displayWeather(data);
                            this.addToHistory(data.name);
                        }
                    }).catch(error => {
                        this.displayError('Unable to fetch weather data for your location.');
                        console.error('Error fetching weather data by coordinates:', error);
                    });
                },
                (error) => {
                    this.displayError('Unable to retrieve your location.');
                    console.error('Geolocation error:', error);
                }
            );
        } else {
            this.displayError('Geolocation is not supported by your browser.');
        }
    }

    displayWeather(data) {
        const weatherHTML = `
            <h2>${data.name}</h2>
            <p>Temperature: ${(data.main.temp - 273.15).toFixed(2)} °C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
        `;
        this.weatherContainer.innerHTML = weatherHTML;
        this.cityInput.value = ''; // Clear input after search
    }

    displayError(message) {
        this.weatherContainer.innerHTML = `<p class="error">${message}</p>`;
    }

    addToHistory(city) {
        if (!this.searchHistory.includes(city)) {
            this.searchHistory.push(city);
            this.updateHistoryList();
        }
    }

    updateHistoryList() {
        this.historyList.innerHTML = this.searchHistory.map(city => `<li>${city}</li>`).join('');
        localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    }

    loadHistoryFromLocalStorage() {
        const history = JSON.parse(localStorage.getItem('searchHistory'));
        if (history) {
            this.searchHistory = history;
            this.updateHistoryList();
        }
    }

    handleHistoryClick(e) {
        if (e.target.tagName === 'LI') {
            const city = e.target.textContent;
            this.handleSearch(city);
        }
    }

    updateURL(city) {
        const url = new URL(window.location);
        url.searchParams.set('city', city);
        window.history.pushState({}, '', url);
    }
}

const app = new WeatherApp();
export const API_KEY = 'fca715368f0ae7bf471fd1da27f464fb';
export const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export function fetchWeather(city) {
  return fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Weather data not found');
          }
          return response.json();
      })
      .catch(error => {
          console.error('Error fetching weather data:', error);
          return { cod: '404', message: error.message };
      });
}

export function fetchWeatherByCoordinates(lat, lon) {
  return fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Weather data not found');
          }
          return response.json();
      })
      .catch(error => {
          console.error('Error fetching weather data by coordinates:', error);
          return { cod: '404', message: error.message };
      });
}
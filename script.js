document.getElementById('weatherForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;

    try {
      const response = await fetch(`/weather?city=${city}&state=${state}`);
      const data = await response.json();

      if (response.ok) {
        displayWeather(data, city, state);
      } else {
        document.getElementById('weatherDisplay').innerText = data.error;
      }
    } catch (error) {
      document.getElementById('weatherDisplay').innerText = 'Failed to fetch data';
    }
  });

  function displayWeather(data, city, state) {
    const display = document.getElementById('weatherDisplay');
    display.innerHTML = `
      <h2>Weather in ${city}, ${state}</h2>
      <p>${data.description}</p>
      <p>Temperature: ${data.temperature} °F</p>
      <p>Wind Speed: ${data.wind_speed} mph</p>
      <img src="icons/${data.condition}.svg" alt="${data.condition}">
    `;
    document.body.style.backgroundColor = getThemeColor(data.condition);
  }

  function getThemeColor(condition) {
    const themes = {
      clear: '#FFD700',
      cloudy: '#C0C0C0',
      rain: '#87CEFA',
      snow: '#FFFFFF',
      mist: '#708090',
      default: '#87CEEB'
    };
    return themes[condition] || themes['default'];
  }

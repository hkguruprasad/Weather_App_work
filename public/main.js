const api = {
	key: "e6c157bdda953e2d4e70ecacfb893c1f",
	base: "https://api.openweathermap.org/data/2.5/",
	key2: "454c97f6a99c455087c94306221108",
	base2: "https://api.worldweatheronline.com/premium/v1/weather.ashx?key="
}

const searchbox = document.querySelector('.search-box');
const checkbox = document.querySelector("input[name=metricSystem]");
const container = document.getElementById("forecast");

//onDOMLodaed
document.addEventListener('DOMContentLoaded', function () {
	searchbox.addEventListener('keypress', setQuery);
	checkbox.addEventListener('change', function () {
		getResults(searchbox.value);
	});
});

function setQuery(evt) {
	if (evt.keyCode == 13) {
		getResults(searchbox.value);
	}
}

function getResults(query) {
	fetch(`${api.base2}${api.key2}&q=${query}&num_of_days=11&format=JSON`)
		.then(weather => {
			return weather.json();
		}).then(result => {
			container.style.display = "block";
			displayForecast(result.data.weather);
		}).catch(error => {
			container.style.display = "none";
			console.error(error);
		});
	fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
		.then(weather => {
			return weather.json();
		}).then(displayResults)
		.catch(error => console.log(error));
}

function displayResults(weather) {
	let city = document.querySelector('.location .city');
	city.innerText = `${weather.name}, ${weather.sys.country}`;
	let system = getSystem();
	let mainTemp, minTemp, maxTemp;
	if (system === "metric") {
		mainTemp = Math.round(weather.main.temp);
		minTemp = Math.round(weather.main.temp_min);
		maxTemp = Math.round(weather.main.temp_max);
	} else {
		mainTemp = Math.round(convertToFaranheit(weather.main.temp));
		minTemp = Math.round(convertToFaranheit(weather.main.temp_min));
		maxTemp = Math.round(convertToFaranheit(weather.main.temp_max));
	}

	let now = new Date();
	let date = document.querySelector('.location .date');
	date.innerText = dateBuilder(now);

	let temp = document.querySelector('.current .temp');
	temp.innerHTML = system === "metric" ? `${mainTemp}<span>°c</span>` : `${mainTemp}<span>°F</span>`;

	let weather_el = document.querySelector('.current .weather');
	weather_el.innerText = weather.weather[0].main;

	let hilow = document.querySelector('.hi-low');
	hilow.innerText = system === "metric" ? `${maxTemp}°c / ${minTemp}°c` : `${maxTemp}°F / ${minTemp}°F`;
}

function dateBuilder(d) {
	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

	let day = days[d.getDay()];
	let date = d.getDate();
	let month = months[d.getMonth()];
	let year = d.getFullYear();

	return `${day} ${date} ${month} ${year}`;
}

function displayForecast(forecast) {
	let system = getSystem();
	container.innerHTML = "";
	let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

	for (let i = 1; i < forecast.length; i++) {
		var forecastLineContainer = document.createElement("div");
		forecastLineContainer.setAttribute('class', "forecast_container");

		//displayDate
		var dateContainer = document.createElement("div");
		let date = new Date(forecast[i].date);
		dateContainer.setAttribute('class', "date");
		dateContainer.innerText = `${days[date.getDay()]}, ${date.getDate()}`;
		forecastLineContainer.appendChild(dateContainer);

		//display Temp
		var tempContainer = document.createElement("div");
		tempContainer.setAttribute('class', "maxMin");
		tempContainer.innerText = system === "metric" ? `${Math.round(forecast[i].maxtempC)}°c / ${Math.round(forecast[i].mintempC)}°c` : `${Math.round(forecast[i].maxtempF)}°F / ${Math.round(forecast[i].mintempF)}°F`;
		forecastLineContainer.appendChild(tempContainer);

		//weather Desc
		var weatherDescContainer = document.createElement("div");
		weatherDescContainer.setAttribute('class', "weatherDesc");
		weatherDescContainer.innerText = forecast[i].hourly[3].weatherDesc[0].value;
		forecastLineContainer.appendChild(weatherDescContainer);

		//precipitaion
		var precipitation = document.createElement("div");
		precipitation.setAttribute('class', 'precipitationContainer');
		var precipitaionContainer = document.createElement("div");
		var img = document.createElement('img');
		img.src = 'rain_icon.png';
		precipitaionContainer.setAttribute('class', "precContainer");
		precipitaionContainer.innerText = system === "metric" ? `${forecast[i].hourly[5].precipMM} mm` : `${forecast[i].hourly[5].precipInches} in`;
		precipitation.appendChild(img);
		precipitation.appendChild(precipitaionContainer);
		forecastLineContainer.appendChild(precipitation);

		//wind speed
		var wind = document.createElement("div");
		wind.setAttribute('class', 'windContainer');
		var windSpeedContainer = document.createElement("div");
		var windImg = document.createElement('img');
		windImg.src = 'wind.png';
		windSpeedContainer.setAttribute('class', "windSubContainer");
		windSpeedContainer.innerText = system === "metric" ? `${forecast[i].hourly[5].WindGustKmph} kmph` : `${forecast[i].hourly[5].WindGustMiles} mph`;
		wind.appendChild(windImg);
		wind.appendChild(windSpeedContainer);
		forecastLineContainer.appendChild(wind);

		container.appendChild(forecastLineContainer);
	}
}

function convertToFaranheit(temp) {
	return (temp * 1.8) + 32;
}

function getSystem(){
	let system =checkbox.checked === true ? "imperial" : "metric";
	return system;
}
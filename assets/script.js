var CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}"

var FIVEDAY_URL = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}"

var API_KEY = "ecf93a350f79170003274920b23e7b6d"

var cityInput = document.querySelector('#search-city')
var searchBtn = document.querySelector('.btn')
var fiveDayEl = document.querySelector('.five-day')
var cityHistory = document.querySelector('.city-History')
var dayjs = dayjs()

searchBtn.addEventListener('click', getCity)

function getCity(event) {
    event.preventDefault()
    var city = cityInput.value


    getCurrentForecast(city)
}

function getCurrentForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`)
        .then(response => response.json())
        .then(currentData => {

            console.log(currentData)
            let storedCities = localStorage.getItem("city")
                ? JSON.parse(localStorage.getItem("city"))
                : [];

            storedCities.push(currentData.name);
            localStorage.setItem("city", JSON.stringify(storedCities));


            var lat = currentData.coord.lat
            var lon = currentData.coord.lon
            getFiveDayForecast(lat, lon)

            var currentForecast = document.querySelector(".current-forecast")
            currentForecast.classList.add('card')
            console.log(currentForecast);

            var currentCity = document.querySelector('.current-city')
            currentCity.setAttribute("style", " font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;")

            currentCity.textContent = currentData.name + dayjs.format("     (MM/DD/YYYY) 🔆")
            if (currentData.name.temp >= 50) {
                currentCity.textContent = currentData.name.temp + dayjs.format("     (MM/DD/YYYY) 🌥️")
            } else {
                currentCity.textContent = currentData.name + dayjs.format("     (MM/DD/YYYY) 🔆")
            }

            var currentTemp = document.querySelector('.current-temp')
            currentTemp.textContent = "Temp: " + currentData.main.temp + "˚F"

            var currentWind = document.querySelector('.current-wind')
            currentWind.textContent = "Wind: " + currentData.wind.speed + " MHP"

            var currentHumidity = document.querySelector('.current-humidity')
            currentHumidity.textContent = "Humidity: " + currentData.main.humidity + "%"
        })
        .catch(err => console.log(err))

}


function getCityHistory() {
    var saveCity = JSON.parse(localStorage.getItem("city"))
    var cityHistory = document.querySelector('.city-History')
    for (var i = 0; i < 8; i++) {

        var button = document.createElement("button")
        button.innerText = saveCity[i]
        button.setAttribute("style", ' display: list-item; width: 200px; margin-top:1em ')
        cityHistory.append(button)
    }
}
getCityHistory()


cityHistory.addEventListener("click", function (event) {
    var button = event.target
    console.log(event.target)
    var city = button.innerHTML;
    getCurrentForecast(city)
})


function getFiveDayForecast(lat, lon) {

    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`)
        .then(response => response.json())
        .then(fiveData => {
            console.log(fiveData)

            var FiveDayForecastTitle = document.querySelector(".FivedayTitle")
            FiveDayForecastTitle.innerHTML ="";
            fiveDayEl.innerHTML = "";

            var fiveDayF = document.createElement('p')
            fiveDayF.textContent = ""
            fiveDayF.textContent = " 5-Day Forecast:  "
            FiveDayForecastTitle.append(fiveDayF)
            fiveDayF.setAttribute("style", 'font-family: Impact, Haettenschweiler, Arial Narrow Bold, sans-serif')


            for (var i = 0; i < 5; i++) {

                var card = document.createElement('div')
                card.setAttribute('class', 'card')
                card.classList.add('p-10')
                fiveDayEl.append(card)


                var fiveDayDate = document.createElement('h4')
                fiveDayDate.textContent = dayjs.add(i + 1, 'days').format("MM/DD/YYYY")
                card.append(fiveDayDate)

                var fiveDayImo = document.createElement('h5')
                if (fiveData.list[i * 8].main.temp > 50) {
                    fiveDayImo.textContent = " 🌥️ "
                } else {
                    fiveDayImo.textContent = " ☀️ "
                }
                card.append(fiveDayImo)


                var fiveDayTemp = document.createElement('p')
                fiveDayTemp.textContent = "Temp: " + fiveData.list[i * 8].main.temp + "  ˚F"
                card.append(fiveDayTemp)

                var fiveDayWind = document.createElement('p')
                fiveDayWind.textContent = "Wind: " + fiveData.list[i * 8].wind.speed + " MPH"
                card.append(fiveDayWind)

                var fiveDayHumidity = document.createElement('p')
                fiveDayHumidity.textContent = "Humidity: " + fiveData.list[i * 8].main.humidity + " %"
                card.append(fiveDayHumidity)
            }
        })
        .catch(err => console.log(err))
}
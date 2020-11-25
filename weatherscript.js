const api = {
    key: config.KEY,
    base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress',setQuery);

function setQuery(ev) {
    if (ev.keyCode == 13) {
        getResults(searchbox.value);
    }
}

function getResults(query) {
    fetch(`${api.base}weather?q=${query}&lang=pt&units=metric&APPID=${api.key}`)
        .then(weather => {
            return weather.json();
        }) .then(displayResults);
}

function getResults2(lat, long) {
    fetch(`${api.base}weather?lat=${lat}&lon=${long}&lang=pt&units=metric&APPID=${api.key}`)
        .then(weather => {
            return weather.json();
        }) .then(displayResults);
}

function displayResults (weather) {
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder((weather.timezone/3600));
    
    // function updateClock() {
    //     console.log((weather.timezone/3600));
    //     date.innerText = dateBuilder((weather.timezone/3600));
    // }
    
    // setInterval(updateClock, 3000);

    let temp = document.querySelector('.weather-current .temp')
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;
    
    let icon = document.querySelector('.weather-current .icon');
    let icons = {
        "01d": `fas fa-sun`,
        "01n": `far fa-moon`,
        "02d": `fas fa-cloud-sun`,
        "02n": `fas fa-cloud-moon`,
        "03d": `fas fa-cloud`,
        "04n": `fas fa-cloud`,
        "04d": `fas fa-cloud`,
        "03n": `fas fa-cloud`,
        "09d": `faas fa-cloud-showers-heavy`,
        "09n": `fas fa-cloud-showers-heavy`,
        "10d": `fas fa-cloud-sun-rain`,
        "10n": `fas fa-cloud-moon-rain`,
        "11d": `fas fa-cloud-showers-heavy`,
        "11n": `fas fa-cloud-showers-heavy`,
        "13d": `far fa-snowflake`,
        "13n": `far fa-snowflake`,
        "50d": `fas fa-smog`,
        "d0n": `fas fa-smog`
    };
    
    if (Object.keys(icons).includes(weather.weather[0].icon)) {
        icon.innerHTML = `<i class="${icons[weather.weather[0].icon]}"></i>`;
    } else {
        icon.innerHTML = `<img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png">`;
    }

    let weather_el = document.querySelector('.weather-current .weather');
    weather_el.innerText = weather.weather[0].description;

    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
}

function dateBuilder(offset) {
    var d = new Date();
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000*offset));

    let months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    let days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

    let day = days[nd.getDay()];
    let date = nd.getDate();
    let month = months[nd.getMonth()];
    // let year = nd.getFullYear();
    let hour = ('0'+nd.getHours()).slice(-2);
    let mins = ('0'+nd.getMinutes()).slice(-2);

    return `${hour}:${mins} - ${day}, ${date} de ${month}`;
}

window.addEventListener('load', () => {
    let long;
    let lat;
    navigator.permissions.query({name:'geolocation'}).then(function(result) {
        if (result.state == 'granted') {
            navigator.geolocation.getCurrentPosition(position => {
                long = position.coords.longitude;
                lat = position.coords.latitude;
                
                getResults2(lat, long);
                
                });
        } else {
            getResults("Lisboa");
        }
    });
});

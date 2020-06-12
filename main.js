//weather app by Val Bryan for educational purposes

const locate = document.getElementById("location");
const pic = document.getElementById("pic");
const temp = document.getElementById("temp");
const desc = document.getElementById("desc");
const scale = document.getElementById("tempScale");
const date = document.getElementById("date");
const convert = document.getElementById("convert");

const weather = {};
const d = new Date();

weather.picIcons = {
    "11d" : "icons/storm.svg",
    "09d" : "icons/rain.svg",
    "10d" : "icons/rain.svg",
    "13d" : "icons/snow.svg",
    "50d" : "icons/wind.svg",
    "01d" : "icons/sun.svg",
    "01n" : "icons/moon.svg",
    "02d" : "icons/clouds.svg",
    "03d" : "icons/clouds.svg",
    "04d" : "icons/clouds.svg",
    "02n" : "icons/clouds.svg",
    "03n" : "icons/clouds.svg",
    "04n" : "icons/clouds.svg"
}


//checks which button was pressed (submit or get location?)
document.getElementById("search").addEventListener("click", (event) => {
    event.preventDefault();
    console.log(event.target.id);
    if (event.target.id == "submitted") {
        submitted();
    } else if (event.target.id == "currentLoc") {
        getLocation();
    }
});

//checks if the user would like to convert the temperature scale
convert.addEventListener("click", conversion);


//gives different URLs for the API call depending on which button was earlier pressed
function callingWeather(city){
    function whichURL(city){
        let url = " ";
        if(!weather.check) {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=98b88b428af5faf67861023798954fc8`;
        } else {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${city.coords.latitude}&lon=${city.coords.longitude}&appid=98b88b428af5faf67861023798954fc8`
        }
        console.log(url);
        changeHeader();
        return url;
    }


    fetch(whichURL(city))
        .then(response => {
            if (response.ok) {
                console.log("SUCCESS");
            } else {
                console.log("NOT SUCCESSFULL");
            }
                return response.json()
        })
        //associates API objects so they may be used in other functions
        .then(data => {
            console.log(data);
            weather.temp = data.main.temp;
            weather.desc = data.weather[0].main;
            weather.pic = data.weather[0].icon;
            weather.name = data.name;
            weather.country = data.sys.country;

            changeWeather();
            displayWeather();

        })
        //adding in an error
        .catch(error => {
            console.log("ERROR")
            document.getElementById("error").style.display = "flex";
            document.getElementById("error").innerText = "Something went wrong :-(";
            weather.error = "true";
        })
}

//gets the user's current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callingWeather);
        //adds a check that this function was initiated
        weather.check = true;
    }
}


//changes the displayed weather content
function changeWeather(){
    locate.innerHTML = `${weather.name}, ${weather.country}`;
    pic.src = weather.picIcons[weather.pic];
    temp.innerHTML = checkType(weather.temp);
    desc.innerHTML = weather.desc;
    date.innerHTML = d.toDateString();
}   
//changes top elements after interactions
function changeHeader(){
    document.getElementById("header").style.height = "70px";
    document.getElementById("header").style.marginBottom = "0";
    document.getElementsByTagName("H1")[0].style.fontSize = "3em";
    document.getElementsByTagName("H1")[0].style.paddingTop = ".1em";
    document.getElementById("spinner").style.display = "flex";
}
//hides or reveals the container with the weather or shows a spinner in place
function displayWeather(){
    document.getElementById("spinner").style.display = "none";
    document.getElementById("container").style.display = "flex";
    if (weather.error) {
        document.getElementById("error").style.display = "none";
        weather.error = "false";
    }
}
//performs weather conversion
function checkType(t){
    if (scale.innerHTML == "°F") {
        return Math.round((t - 273.15) * (9/5) + 32);
    } else {
        return Math.round(t - 273.15);
    }
}

function submitted(){
    let city = document.getElementById("searchbox").value;
    weather.check = false;
    callingWeather(city);
}

//checks which weather scale and then references checkType to perform said conversion
function conversion(){
    if (scale.innerHTML == "°F") {
        scale.innerHTML = "°C";
        convert.innerHTML ="°F?";
    } else {
        scale.innerHTML = "°F";
        convert.innerHTML ="°C?";
    }
    temp.innerHTML = checkType(weather.temp);
}

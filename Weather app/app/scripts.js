const city = document.getElementById("City");
const date = document.getElementById("Date");
const API = "4fc05002d20dc2a48b960c4834baf32d";
const inputValue = document.getElementById("inputValue");
const iconSearch = document.querySelector(".icon-search");
const temperatureDayChoice = document.querySelectorAll(".temperatureDayChoice");
const descriptionMain = document.getElementById("descriptionDayChoice");
const searchBar = document.querySelector(".search-bar");
let locationIcon = document.querySelectorAll(".weather-icon");
const iconFavorite = document.querySelector(".icon-favorite");
const iconFavoriteFull = document.querySelector(".icon-favorite-full");
const detForChoice = document.querySelector(".details-forecast-choice");
const forecastHours = document.querySelector(".forecast-hours");
const myContainer = document.querySelector(".my-container");

// CHECKCITY
const favorite = document.querySelector(".favorite");
const closeModalBtn = document.querySelector(".close-modal-btn");
const popUp = document.querySelector(".pop-up");
const addCity = document.querySelector(".add-city");
const trashIcon = document.querySelector(".trash-icon");
const popUpBtn = document.querySelector(".pop-up-btn");
const inputPopUp = document.getElementById("input-pop-up");

//////////////////////////////////////////////
// Fetch APi  - CITY
//////////////////////////////////////////////
getData = (x) => {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${x},&appid=${API}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const lon = data.coord.lon;
      const lat = data.coord.lat;
      firstAPI(lat, lon);
      secondAPI(lat, lon);
    })
    .catch((err) => alert("Wrong City Name!"));
};

function clearInput() {
  inputValue.value = "";
}

iconSearch.addEventListener("click", function () {
  getData(inputValue.value);
  clearInput();
});

inputValue.addEventListener("keydown", function (event) {
  console.log(event);
  // event.preventDefault();
  if (event.key === "Enter") {
    console.log(inputValue.value);
    getData(inputValue.value.toString());
    // clearInput();
  }
});

//////////////////////////////////////////////
// FETCH API WITH LAT AND LON
//////////////////////////////////////////////
firstAPI = (lat, lon) => {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API}&units=metric
  `
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      getCity(data.city.name, data.city.country);
      getDate(data.list[0].dt_txt, data.list[0].dt_txt);
      getMainDescription(data.list[0].weather[0].description);
      getSunriseSunset(data.city.timezone, data.city.sunrise, data.city.sunset);
      getHumidity(data.list[0].main.humidity);
      forecastNameDays(data.list[0].dt_txt);
      forecastDateDays(data.list[0].dt_txt);
      forecastDaysIcon(data.list);
      forecastHoursTime(data.list[0].dt_txt);
      forecastHoursTemp(data.list);
      forecastHoursImg(data.list);
      backgroundImg(data.list[0].weather[0].main);
      console.log(data);
    });
};
//////////////////////////////////////////////
// SECOND API
//////////////////////////////////////////////
secondAPI = async (lat, lon) => {
  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      getMainTemp(data.current_weather.temperature);
      getWindSpeed(data.current_weather.windspeed);
      getHightTemperature(data.hourly.temperature_2m);
      forecastDaysTemp(data.hourly.temperature_2m);
      console.log(data);
    });
};

//////////////////////////////////////////////
// CHECK CITY
//////////////////////////////////////////////
const checkCity = async (x) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${x},&appid=${API}`
  );
  if (!response.ok) {
    alert("Acest oras nu exista sau nu este gasit.");
    return false;
  }
  const data = await response.json();
  console.log(data);
  return true;
};

iconFavorite.addEventListener("click", function () {
  searchBar.classList.toggle("borders-edit");
  favorite.classList.toggle("d-none");
});

const TogglePopUp = function () {
  popUp.classList.toggle("d-none");
  myContainer.classList.toggle("blur");
};
addCity.addEventListener("click", TogglePopUp);

closeModalBtn.addEventListener("click", function () {
  popUp.classList.toggle("d-none");
  myContainer.classList.toggle("blur");
});

popUpBtn.addEventListener("click", async function (event) {
  event.preventDefault();
  if (inputPopUp.value !== "") {
    // try {
    const result = await checkCity(inputPopUp.value);
    console.log(result);
    if (result) {
      addLi(inputPopUp);
      inputPopUp.value = "";
      TogglePopUp();
    } else {
      inputPopUp.value = "";
    }
  } else alert("Introduceti orasul");
});

//create li element
const addLi = function (city) {
  const ol = document.getElementById("list");
  const li = document.createElement("li");
  const p = document.createElement("p");
  p.classList.add("city-name");
  p.innerHTML = city.value;

  li.appendChild(p);
  const span = document.createElement("span");
  span.innerHTML =
    '<ion-icon class="trash-icon" name="trash-outline"></ion-icon>';
  li.appendChild(span);
  ol.appendChild(li);
  span.addEventListener("click", function () {
    li.remove();
  });
  ol.addEventListener("click", function (event) {
    if (event.target && event.target.matches("p.city-name")) {
      getData(event.target.innerHTML);
      searchBar.classList.toggle("borders-edit");
      favorite.classList.toggle("d-none");
      inputValue.value = "";
    }
  });
};

//////////////////////////////////////////////
// GET LOCATION
//////////////////////////////////////////////
const getLocation = async function () {
  const successCallback = (position) => {
    console.log(position);
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    firstAPI(latitude, longitude);
    secondAPI(latitude, longitude);
  };

  const errorCallback = (error) => {
    console.log(error);
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
};
getLocation();

// ORASUL + TARA
const getCity = function (City, Country) {
  city.innerHTML = City + ", " + Country;
};

// DATA
const getDate = function (x, y) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let dateTime;
  const d = new Date(x);
  const dayName = days[d.getDay()];
  if (y[8] > 0) dateTime = y[8] + y[9];
  else dateTime = y[9];
  const monthName = months[d.getMonth()];

  date.innerHTML = dayName + " " + dateTime + " " + monthName;
};

// TEMPERATURA LA ZIUA ALEASA SI PRIMA ZI DIN CELE 7
const getMainTemp = function (temp) {
  temperatureDayChoice[0].innerHTML = Math.round(temp) + "°C";
  temperatureDayChoice[1].innerHTML = Math.round(temp) + "°C";
  document.getElementById("day1-°C").innerHTML = Math.round(temp) + "°C";
};
//descrierea pentru vremea din prezent
const getMainDescription = function (x) {
  descriptionMain.innerHTML = x;
};
// WINDSPEED
const getWindSpeed = function (x) {
  document.getElementById("windSpeed").innerHTML = Math.round(x) + "mph";
};
// SUNRINSE & SUNSET
const getSunriseSunset = function (tz, sunrise, sunset) {
  const x = moment.utc(sunrise, "X").add(tz, "seconds").format("HH:mm");
  const y = moment.utc(sunset, "X").add(tz, "seconds").format("HH:mm");
  document.getElementById("sunrise").innerHTML = x;
  document.getElementById("sunset").innerHTML = y;
};

// HUMIDITY
const getHumidity = function (x) {
  document.getElementById("humidity").innerHTML = x + "%";
};
//temperatura maxima si minima
const getHightTemperature = function (x) {
  const temps = x.slice(0, 23);
  let maxTemp = x[0];
  let minTemp = x[0];
  for (const item in temps) {
    if (x[item] > maxTemp) maxTemp = x[item];
  }
  for (const item in temps) {
    if (x[item] < minTemp) minTemp = x[item];
  }
  document.getElementById("high-temperature").innerHTML =
    Math.round(maxTemp) + "°C";
  document.getElementById("low-temperature").innerHTML =
    Math.round(minTemp) + "°C";
};

const forecastNameDays = function (x) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];
  const d = new Date(x);
  const prefix = "day";
  const elements = {};
  for (let i = 0; i < 7; i++) {
    let j = i + 1;
    let id = prefix + j + "-name";
    elements["day" + j] = document.getElementById(id);
    elements["day" + j].innerHTML = days[d.getDay() + i];
  }
};
// data pentru forecastul celor 7 zile
const forecastDateDays = function (x) {
  let startDate = new Date(x);
  const array = [0, 1, 2, 3, 4, 5, 6];
  const myDate = [];
  for (const item of array) {
    const day = array[item] * (60 * 60 * 24 * 1000);
    let endDay = new Date(startDate.getTime() + day);
    const day1 = endDay.getDate();
    const month = endDay.getMonth() + 1;
    const formattedDate = `${day1 < 10 ? "0" : ""}${day1}.${
      month < 10 ? "0" : ""
    }${month}`;
    myDate.push(formattedDate);
  }
  const prefix = "day";
  const elements = {};
  for (let i = 0; i < 7; i++) {
    let j = i + 1;
    let id = prefix + j + "-date";
    elements["day" + j] = document.getElementById(id);
    elements["day" + j].innerHTML = myDate[i];
  }
};
// temeperatura pentru forecastul celor 7 zile
const forecastDaysTemp = function (x) {
  let a = 0;
  let b = 23;
  const c = 24;
  const array = [1, 2, 3, 4, 5, 6];
  const myTemps = [];
  for (const i of array) {
    a += c;
    b += c;
    let sum = 0;
    const temps = x.slice(a, b);
    for (const j of temps) {
      sum += j;
    }
    myTemps.push(sum / 24);
  }
  const prefix = "day";
  const elements = {};
  for (let i = 0; i < 6; i++) {
    let j = i + 2;
    let id = prefix + j + "-°C";
    elements["temp" + j] = document.getElementById(id);
    elements["temp" + j].innerHTML = Math.round(myTemps[i]) + "°C";
  }
};

// Iconita pentru forecastul celor 7 zile
const forecastDaysIcon = function (x) {
  const weatherImg = [];
  for (let i = 0; i < 40; i = i + 8) {
    const img = x[i].weather[0].icon;
    if (i === 0) i = -1;
    weatherImg.push(img);
  }
  locationIcon[0].innerHTML = `<img src="icons/${weatherImg[0]}.png"></img>`;
  locationIcon[1].innerHTML = `<img src="icons/${weatherImg[0]}.png"></img>`;
  document.getElementById(
    "day1-icon"
  ).innerHTML = `<img src="icons/${weatherImg[0]}.png"></img>`;
  document.getElementById(
    "day7-icon"
  ).innerHTML = `<img src="icons/${weatherImg[5]}.png"></img>`;
  const prefix = "day";
  const elements = {};
  for (let i = 0; i < 6; i++) {
    let j = i + 1;
    let id = prefix + j + "-icon";
    elements["icon" + j] = document.getElementById(id);
    elements[
      "icon" + j
    ].innerHTML = `<img src="icons/${weatherImg[i]}.png"></img>`;
  }
};

// ora pentru forecastul orelor in 3 in 3 - verificat
const forecastHoursTime = function (x) {
  let startDate = new Date(x);
  const array = [0, 1, 2, 3, 4, 5, 6, 7];
  const myHours = [];
  for (const item of array) {
    const hour = array[item] * (60 * 60 * 3 * 1000);
    let endHour = new Date(startDate.getTime() + hour);
    const hour1 = endHour.getHours();
    const formattedDate = `${hour1 < 10 ? "0" : ""}${hour1}:00`;
    myHours.push(formattedDate);
  }
  const prefix = "hour";
  const elements = {};
  for (let i = 0; i < 8; i++) {
    let j = i + 1;
    let id = prefix + j + "-forecast";
    elements["hour" + j] = document.getElementById(id);
    elements["hour" + j].innerHTML = myHours[i];
  }
};
// Temperatura din 3 in 3 ore - verificat
const forecastHoursTemp = function (x) {
  const forecastTemps = [];

  for (let i = 0; i < 8; i++) {
    const temp = x[i].main.temp;
    forecastTemps.push(temp);
  }
  const prefix = "temp";
  const elements = {};
  for (let i = 0; i < 8; i++) {
    let j = i + 1;
    let id = prefix + j + "-forecast";
    elements["tempH" + j] = document.getElementById(id);
    elements["tempH" + j].innerHTML = Math.round(forecastTemps[i]) + "°C";
  }
};

//Iconita la orele zilei alese, din 3 in 3 - verificat
const forecastHoursImg = function (x) {
  const weatherImg = [];
  for (let i = 0; i < 8; i++) {
    const img = x[i].weather[0].icon;
    weatherImg.push(img);
  }
  const prefix = "img";
  const elements = {};
  for (let i = 0; i < 8; i++) {
    let j = i + 1;
    let id = prefix + j + "-hour";
    elements["imgH" + j] = document.getElementById(id);
    elements[
      "imgH" + j
    ].innerHTML = `<img src="icons/${weatherImg[i]}.png"></img>`;
  }
};

//background img

const backgroundImg = function (weather) {
  const container = document.querySelector(".my-container");
  container.style.backgroundImage =
    "linear-gradient(to right bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(img/default.jpg)";

  if (weather === "Clear") {
    container.style.backgroundImage =
      "linear-gradient(to right bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(img/clear.jpg)";
  } else if (weather === "Clouds") {
    container.style.backgroundImage =
      "linear-gradient(to right bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(img/clouds.jpg)";
  } else if (weather === "Rain") {
    container.style.backgroundImage =
      "linear-gradient(to right bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(img/rain.jpg)";
  } else if (weather === "Snow") {
    container.style.backgroundImage =
      "linear-gradient(to right bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(img/snow.jpg)";
  } else {
    container.style.backgroundImage =
      "linear-gradient(to right bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(img/default.jpg)";
  }
};

// BUTONS

const arrowRight = document.querySelectorAll(".chevron-right");
const arrowLeft = document.querySelectorAll(".chevron-left");

for (const item of [0, 1]) {
  arrowRight[item].addEventListener("click", function () {
    detForChoice.classList.toggle("d-none");
    forecastHours.classList.toggle("d-none");
  });
  arrowLeft[item].addEventListener("click", function () {
    detForChoice.classList.toggle("d-none");
    forecastHours.classList.toggle("d-none");
  });
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather-app-main',
  templateUrl: './weather-app-main.component.html',
  styleUrls: ['./weather-app-main.component.css']
})
export class WeatherAppMainComponent implements OnInit {

  //  Weather data JSON object that will be fetched from the Open Weather API
  WeatherData: any;

  constructor() { }

  ngOnInit(): void {

    this.WeatherData = {
      main: {},
      isDayTime: true,
      isCloudy: false
    };
    //  Call getWeatherData function right away
    this.getWeatherData();

  }

  //  Returns the weather information. Uses 'fetch' function in Js to call API and stores returned object in WeatherData
  getWeatherData(){

    //  fetch() takes in the URL of the API as an arg and returns a promise and a callback function is queued when the promise is successful
    fetch('http://api.openweathermap.org/data/2.5/weather?q=phoenix&appid=77b1d01ab160310d93e7d9843630b9cd')
    .then(response => response.json()) // Calls response.json function to convert the returned data into a Js object
    .then(data => {this.setWeatherData(data);}) //  When we have the data then we call setWeatherData function and provide the Js object as an arg

  }

  setWeatherData(data: any){

    // WeatherData is the JSON object with all the information, it is used to create more variables to display in the view
    this.WeatherData = data;

    this.WeatherData.city = this.WeatherData.name;
    this.WeatherData.mainDesc = this.WeatherData.weather[0].main;
    this.WeatherData.description = this.WeatherData.weather[0].description;

    //  Checks if the weather description is cloudy to include a cloud in the view
    if(this.WeatherData.mainDesc == "Clouds"){
      this.WeatherData.isCloudy = true;
    }
    else{
      this.WeatherData.isCloudy = false;
    }

    this.WeatherData.windSpeed = this.WeatherData.wind.speed * 2.23694;
    this.WeatherData.windSpeed = this.WeatherData.windSpeed.toFixed(1);

    //  Temperature is in Kelvin and needs to be converted to Fahrenheit
    this.WeatherData.tempFahrenheit = ((9/5) * (this.WeatherData.main.temp - 273) + 32);
    this.WeatherData.tempFahrenheit = this.WeatherData.tempFahrenheit.toFixed(0);// Limit to one decimal place
    this.WeatherData.tempLow = ((9/5) * (this.WeatherData.main.temp_min - 273) + 32);
    this.WeatherData.tempLow = this.WeatherData.tempLow.toFixed(0);
    this.WeatherData.tempHigh = ((9/5) * (this.WeatherData.main.temp_max - 273) + 32);
    this.WeatherData.tempHigh = this.WeatherData.tempHigh.toFixed(0);

    //  Presenting time in the form of hours:minutes:seconds rather than how its returned, this.WeatherData.sys.sunrise returns time in unix UTC
    let sunriseTime = new Date(this.WeatherData.sys.sunrise * 1000);
    this.WeatherData.sunriseTime = sunriseTime.getHours() + ":" + sunriseTime.getMinutes() + ":" + sunriseTime.getSeconds();
    let sunsetTime = new Date(this.WeatherData.sys.sunset * 1000);
    this.WeatherData.sunsetTime = (sunsetTime.getHours() - 12) + ":" + sunsetTime.getMinutes() + ":" + sunsetTime.getSeconds();

    // The current time is checked against the sunset time and stores true or false in isDayTime 
    let currentTime = new Date();
    this.WeatherData.currentDate = (currentTime.getMonth() + 1) + "/" + currentTime.getDate() + "/" + currentTime.getFullYear();
    this.WeatherData.isDayTime = currentTime.getTime() < sunsetTime.getTime();
    

  }

}

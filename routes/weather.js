//Create a new router
const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', (req, res, next) => {
    const apiKey = 'a1cc26979675c02be6093ed91b4bcfc5'; 
    const city = req.query.city;

    //If no city is provided, just show the form
    if (!city) {
        return res.send(`
            <h1>Bertie's Books Weather</h1>
            <link rel="stylesheet" type="text/css" href="/weather.css"></link>
            <form action="/weather" method="GET">
                <label for="city">Enter City:</label>
                <input type="text" id="city" name="city" placeholder="e.g. London" required>
                <input type="submit" value="Get Weather">
            </form>
        `);
    }

    // If city is provided, fetch weather
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    request(url, (err, response, body) => {
        if (err) return next(err);
        try {
            const weather = JSON.parse(body);
            if (!weather || !weather.main) {
                return res.send(`<h2>City "${city}" not found.</h2><a href="/weather">Try another city</a>`);
            }
            const wmsg = `
                <h1>Weather in ${weather.name}</h1>
                <link rel="stylesheet" type="text/css" href="/weather.css"></link>
                <p>Temperature: ${weather.main.temp} °C</p>
                <p>Feels like: ${weather.main.feels_like} °C</p>
                <p>Humidity: ${weather.main.humidity}%</p>
                <p>Pressure: ${weather.main.pressure} hPa</p>
                <p>Wind: ${weather.wind.speed} m/s, direction: ${weather.wind.deg}°</p>
                <a href="/weather">Check another city</a>
                `;
            res.send(wmsg);
        } catch (parseError) {
            next(parseError);
        }
    });
});

module.exports = router;
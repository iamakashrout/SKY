const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render("home")
})

app.post("/", function(req, res){
    console.log(req.body.cityName);
    const query=req.body.cityName;
    const apiKey="75cb791e75f3772b666036c5669ef9f4";
    const url="https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid="+apiKey+"&units=metric";
    https.get(url, function(response){
        console.log(response.statusCode);
        if(response.statusCode>=400){
            res.render("error");
        }
        else{
        response.on("data", function(data){
            const weatherData=JSON.parse(data);
            const temp=weatherData.main.temp;
            const desc=weatherData.weather[0].description;
            const pres=weatherData.main.pressure;
            const hum=weatherData.main.humidity;
            const vis=weatherData.visibility;
            const win=weatherData.wind.speed;
            const icon=weatherData.weather[0].icon;
            const pic="http://openweathermap.org/img/wn/"+icon+"@2x.png";
            res.render("weather", {
                temp: temp,
                desc: desc,
                pres: pres,
                hum: hum,
                vis: vis,
                win: win,
                pic: pic,
                query: query
            });
        })
    }
    })

})


app.listen(3000 || process.env.PORT, function () {
    console.log("Server running on port 3000.");
})
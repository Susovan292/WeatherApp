import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const app=express();
const port=3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const apiKey = process.env.API_KEY;

app.get("/", (req,res)=>{
   res.render('./index.ejs');
});

app.post("/submit", async(req,res)=>{
   const City=req.body["city-name"];
   const api=`https://api.openweathermap.org/data/2.5/weather?q=${City}&appid=${apiKey}&units=metric`;
  try {
    const response = await axios.get(api);
    const sys = response.data.sys;

// Convert Unix timestamp to Date object (milliseconds)
    const sunriseDate = new Date(sys.sunrise * 1000);
    const sunsetDate = new Date(sys.sunset * 1000);

// Convert to India Standard Time (IST)
const options = {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
};

const sunriseTimeIST = sunriseDate.toLocaleString('en-IN', options);
const sunsetTimeIST = sunsetDate.toLocaleString('en-IN', options);

    res.render("submit.ejs",{
       name:response.data.name,
       date:response.headers.date,
       temp:response.data.main.temp,
       feels_like:response.data.main.feels_like,
       pressure:response.data.main.pressure,
       humidity:response.data.main.humidity,
       visibility:response.data.visibility,
       sunRise:sunriseTimeIST,
       sunSet:sunsetTimeIST,
       wind:response.data.wind.speed,
       
    });
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
});

app.listen(port, ()=> {
console.log(`Server listening on Port ${port}`, port);
});

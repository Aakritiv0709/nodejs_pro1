const http = require("http");
const fs = require("fs");
const axios = require("axios");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  // temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?q=satna&appid=5ab5f4e969a5d5199686af2b10aa2407"
      )
      .then((response) => {
        const objdata = response.data;
        const arrData = [objdata];
        const realTimeData = arrData.map((val) => {
          return replaceVal(homeFile, val);
        });

        // Update homeFile with the modified content
        const updatedHomeFile = realTimeData[0];

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(updatedHomeFile);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error.message);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error");
      });
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

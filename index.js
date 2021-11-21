const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

 

const replaceVal=(htmlpage,orgval)=>{
    let temperature=htmlpage.replace('{%tempval%}',orgval.main.temp)
    temperature=temperature.replace('{%tempmin%}',orgval.main.temp_min)
    temperature=temperature.replace('{%tempmax%}',orgval.main.temp_max)
    temperature=temperature.replace('{%location%}',orgval.name)
    temperature=temperature.replace('{%country%}',orgval.sys.country)
    temperature=temperature.replace('{%tempstatus%}',orgval.weather[0].main)

    return temperature
}



const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests("https://api.openweathermap.org/data/2.5/weather?q=Nagpur&appid=99eae7c64b2155386d4d31ec60aadaf2&units=metric")
      .on("data",  (chunk)=> {
          const objdata=JSON.parse(chunk)
          //convering it into array
          const arrayData=[objdata]
       // console.log(arrayData[0].main.temp);
       const realTimeData=arrayData.map((val)=>
           replaceVal(homeFile,val)).join("")
    //    console.log(realTimeData)
       res.write(realTimeData)
      })
      .on("end",  (err)=> {
        if (err) return console.log("connection closed due to errors", err);
        res.end()
        console.log("end");
      });
  }
});
server.listen(8000,"127.0.0.1")
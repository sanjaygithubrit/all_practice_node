const express = require("express");
const mysql = require('mysql2');
// const querystring = require('query-string')

const app = express();
app.set("view engine", "ejs");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "express"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  
  });

  
  app.get('/users', function (req, res) {

    
     var pageno= req.query.page || 1;
   if(pageno <=0){
    pageno=1;
   }
   if(pageno >=15){
    pageno=15;
   }
    //  console.log(pageno);
     var len = 100;
    var san = (pageno - 1)* len ;
    var nex= pageno + 1;
    var pre= pageno - 1;
    var data_12;
    con.query(`SELECT * FROM student_express limit ${san},${len}`, function (error, data12, fields) {
      if (error) throw error;
    //   console.log(data);
    //   res.render("data2.ejs", { data });
    data_12 = data12
    });
  
    con.query(`SELECT count(id) as sanjay FROM student_express `, function (error, data, fields) {
        if (error) throw error;
        // console.log(data123);
        var a = data[0].sanjay;
        var sanjay_1 = Math.ceil(a/100);

        res.render("data2.ejs", { data:data_12,sanjay:sanjay_1,page:pageno});

      });
  });
  app.listen(5400, function () {
    console.log('Node app is running on port 5400');
  });
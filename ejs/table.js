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


app.get('/users/:page', function (req, res) {

  var x = [];
  //  var page = req.query.page
  con.query('SELECT * FROM student_express limit 0,10', function (error, data1, fields) {
    if (error) throw error;
    x[0] = data1;
  });
  con.query('SELECT * FROM student_express limit 10,10', function (error, data2, fields) {
    if (error) throw error;
    x[1] = data2;
  });
  con.query('SELECT * FROM student_express limit 20,10', function (error, data3, fields) {
    if (error) throw error;
    x[2] = data3;
  });
  con.query('SELECT * FROM student_express limit 30,10', function (error, data4, fields) {
    if (error) throw error;
    x[3] = data4;
  });
  con.query('SELECT * FROM student_express limit 40,10', function (error, data5, fields) {
    if (error) throw error;
    x[4] = data5;
  });
  con.query('SELECT * FROM student_express limit 50,10', function (error, data6, fields) {
    if (error) throw error;
    x[5] = data6;
  });
  con.query('SELECT * FROM student_express limit 60,10', function (error, data7, fields) {
    if (error) throw error;
    x[6] = data7;
  });
  con.query('SELECT * FROM student_express limit 70,10', function (error, data8, fields) {
    if (error) throw error;
    x[7] = data8;
  });
  con.query('SELECT * FROM student_express limit 80,10', function (error, data9, fields) {
    if (error) throw error;
    x[8] = data9;
  });
  con.query('SELECT * FROM student_express limit 90,10', function (error, data10, fields) {
    if (error) throw error;
    x[9] = data10;

    res.render("data.ejs", { data:x });
  });

  
});




app.listen(3500, function () {
  console.log('Node app is running on port 4000');
});
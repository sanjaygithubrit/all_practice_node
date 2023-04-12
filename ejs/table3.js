const express = require("express");
const mysql = require('mysql2');


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


    var pageno = req.query.page || 1;
    var orderby = req.query.order || "first_name";
    var asde = req.query.ad || "ASC" ;
   
     
    if (pageno <= 0) {
        pageno = 1;
    }
    if (pageno >= 15) {
        pageno = 15;
    }
    //  console.log(pageno);
    var len = 100;
    var san = (pageno - 1) * len;
   
    var data_12;
    con.query(`SELECT * FROM student_express order By ${orderby} ${asde} limit ${san},${len}`, function (error, data12, fields) {
        if (error) throw error;
        //   console.log(data);
        //   res.render("data2.ejs", { data });
        data_12 = data12
    });

    con.query(`SELECT count(id) as sanjay FROM student_express `, function (error, data, fields) {
        if (error) throw error;
        // console.log(data123);
        var a = data[0].sanjay;
        var sanjay_1 = Math.ceil(a / 100);

        res.render("data3.ejs", { data: data_12, sanjay: sanjay_1, page: pageno,order:orderby,AD:asde});

    });
});
app.listen(6400, function () {
    console.log('Node app is running on port 6400');
});
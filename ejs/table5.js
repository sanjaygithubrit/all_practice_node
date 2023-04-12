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
    var sanja = req.query.search || 1 ;
    var pageno = req.query.page ||1 ;
    var data1; 

    if (sanja == 1 || '') {
        con.query(`SELECT * FROM student_express  ;`, function (error, data1, fields) {
            if (error) throw error;


            res.render("data5.ejs", { data: data1 ,sanja:''});
        });
    }
    else{


    console.log(sanja);
    var firstname = "";
    var lastname = "";
    var college = "";
    var city = "";
    var email = "";
    var contact = "";

    if (pageno <= 0) {
        pageno = 1;
    }
    if (pageno >= 15) {
        pageno = 15;
    }
     console.log(pageno);
    var len = 10;
    var san = (pageno - 1) * len;


    for (i = 0; i <= sanja.length; i++) {
        if (sanja.charAt(i) == '^') {
            for (j = i + 1; j <= sanja.length; j++) {
                if (sanja.charAt(j) == '%' || sanja.charAt(j) == ',' || sanja.charAt(j) == ':' || sanja.charAt(j) == ';' || sanja.charAt(j) == '=') {
                    break;
                }
                else {
                    firstname += sanja.charAt(j);
                }
            }
            // console.log(sanja);
        }
        else if (sanja.charAt(i) == '%') {
            for (j = i + 1; j <= sanja.length; j++) {
                if (sanja.charAt(j) == '^' || sanja.charAt(j) == ',' || sanja.charAt(j) == ':' || sanja.charAt(j) == ';' || sanja.charAt(j) == '=') {
                    break;
                }
                else {
                    lastname += sanja.charAt(j);
                }

            }
        }
        else if (sanja.charAt(i) == ',') {
            for (j = i + 1; j <= sanja.length; j++) {
                if (sanja.charAt(j) == '^' || sanja.charAt(j) == '%' || sanja.charAt(j) == ':' || sanja.charAt(j) == ';' || sanja.charAt(j) == '=') {
                    break;
                }
                else {
                    college += sanja.charAt(j);
                }

            }
        }
        else if (sanja.charAt(i) == ':') {
            for (j = i + 1; j <= sanja.length; j++) {
                if (sanja.charAt(j) == '^' || sanja.charAt(j) == ',' || sanja.charAt(j) == '%' || sanja.charAt(j) == ';' || sanja.charAt(j) == '=') {
                    break;
                }
                else {
                    city += sanja.charAt(j);
                }

            }
        }
        else if (sanja.charAt(i) == ';') {
            for (j = i + 1; j <= sanja.length; j++) {
                if (sanja.charAt(j) == '^' || sanja.charAt(j) == ',' || sanja.charAt(j) == ':' || sanja.charAt(j) == '%' || sanja.charAt(j) == '=') {
                    break;
                }
                else {
                    email += sanja.charAt(j);
                }

            }
        }
        else if (sanja.charAt(i) == '=') {
            for (j = i + 1; j <= sanja.length; j++) {
                if (sanja.charAt(j) == '^' || sanja.charAt(j) == ',' || sanja.charAt(j) == ':' || sanja.charAt(j) == ';' || sanja.charAt(j) == '%') {
                    break;
                }
                else {
                    contact += sanja.charAt(j);
                }

            }
        }
    }
      

        con.query(`SELECT  count(first_name) as sanjay FROM student_express where first_name like '%${firstname}%' AND last_name like '%${lastname}%'AND college like '%${college}%'AND city like '%${city}%'AND email like '%${email}%'AND contact_no like '%${contact}%';`, function (error, data1234, fields) {
            if (error) throw error;

            var data1 = data1234;
            console.log(data1);
            // res.render("data4.ejs", { count: data1  });
        });

        con.query(`SELECT * FROM student_express where first_name like '%${firstname}%' AND last_name like '%${lastname}%'AND college like '%${college}%'AND city like '%${city}%'AND email like '%${email}%'AND contact_no like '%${contact}%' limit ${san},${len};`, function (error, data1, fields) {
            if (error) throw error;
            // console.log(data1);
            res.render("data5.ejs", { data: data1 ,count: data1,sanja });
        });
    }


});
app.listen(9500, function () {
    console.log('Node app is running on port 9500');
});
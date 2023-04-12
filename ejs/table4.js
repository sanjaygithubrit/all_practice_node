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

    if (sanja == 1 || '') {
        con.query(`SELECT * FROM student_express  ;`, function (error, data1, fields) {
            if (error) throw error;


            res.render("data4.ejs", { data: data1 ,sanja:''});
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
        con.query(`SELECT * FROM student_express where first_name like '%${firstname}%' AND last_name like '%${lastname}%'AND college like '%${college}%'AND city like '%${city}%'AND email like '%${email}%'AND contact_no like '%${contact}%';`, function (error, data1, fields) {
            if (error) throw error;
            res.render("data4.ejs", { data: data1 ,sanja });
        });

        // con.query(`SELECT  count(id) as sanjay FROM student_express where first_name like '%${firstname}%' AND last_name like '%${lastname}%'AND college like '%${college}%'AND city like '%${city}%'AND email like '%${email}%'AND contact_no like '%${contact}%';`, function (error, data1, fields) {
        //     if (error) throw error;
        //     res.render("data4.ejs", { data: data1 ,sanjay:sanja });
        // });
    }


});
app.listen(8500, function () {
    console.log('Node app is running on port 8500');
});
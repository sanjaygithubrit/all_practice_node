const express = require("express");
const mysql = require('mysql2');


const app = express();
app.set("view engine", "ejs");
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "jobapplication"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

});



app.get('/users', function (req, res) {
    var data1;
    var data2;
    var data3;
    var data4;
    var data5;
    var data7;
    var data9;
    var data10;
    // con.query(`select * from select_master where select_box_key = 'select_box_city'`, function (error, data) {
    //     if (error) throw error; 
    //     data1 = data;
    //     // res.render('form.ejs', { data })
    // })
    con.query(`select option_tag_value from option_master where s_id = 2`, function (error, data) {
        if (error) throw error;
        data2 = data;
        // console.log(data)
        // console.log(data1);
       
    })
    con.query(`select option_tag_value from option_master where s_id = 3`, function (error, data) {
        if (error) throw error; 
        data3 = data;
      
    })
    con.query(`select option_tag_value from option_master where s_id = 4`, function (error, data) {
        if (error) throw error; 
        data4 = data;
        
    })
    con.query(`select option_tag_value from option_master where s_id = 5`, function (error, data) {
        if (error) throw error; 
        data5 = data;
       
    })
    con.query(`select option_tag_value from option_master where s_id = 7`, function (error, data) {
        if (error) throw error; 
        data7 = data;
        
    })
    con.query(`select option_tag_value from option_master where s_id = 8`, function (error, data) {
        if (error) throw error; 
        data8 = data;
        
    })
    con.query(`select option_tag_value from option_master where s_id = 9`, function (error, data) {
        if (error) throw error; 
        data9 = data;
        
    })
    con.query(`select option_tag_value from option_master where s_id = 10`, function (error, data) {
        if (error) throw error; 
        data10 = data;
        res.render('form.ejs', { data2,data3,data4,data5,data7,data8,data9,data10})
    })
})

app.post('/form', function (req, res) {
      var f_name = req.body.fname;
      var l_name = req.body.lname;
      var city = req.body.name;
      var state = req.body.state;
      var gender = req.body.male;
      var dob = req.body.dob;
      var contact_no = req.body.phone;
      var address_1 = req.body.add1;
      var address_2 = req.body.add2;
      var relation_status = req.body.rel;
      var zip_code = req.body.zip;
      var designation = req.body.desig;
      var email = req.body.email;

      console.log(f_name)
  
    con.query(`insert into basic_information (f_name,l_name) values('${f_name}','${l_name}');`, function (error, data) {
        
        if (error) throw error; 
        console.log(data)
        
    })
        
    })

app.listen(8800, function () {
    console.log('Node app is running on port 8800');
});
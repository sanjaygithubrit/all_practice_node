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
    database: "exel_table"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

});


// show data 

app.get('/table', function (req, res) {

    
    con.query(`select * from  exel where isdelete = 0 ;`, function (error, result) {
        if (error) throw error;
            // console.log(result)
        res.render("exel.ejs",{result});
    })

})



// update data


app.get('/update', function (req, res) {
    // console.log(req.body.colm1.length)
    // console.log(req.body.colm1[0])
    // var update = req.query.upd;
    var id = req.query.idd;
    // console.log(id)

    // console.log(update);
    var col_1 = req.query.sname;
    // console.log(col_1)
    var col_2 = req.query.fname;
    // console.log(col_2)
    var col_3 = req.query.lname;
    var col_4 = req.query.ccity;
    var col_5 = req.query.sstate;
    con.query(`update exel set col_1 = '${col_1}',col_2 = '${col_2}',col_3 = '${col_3}',col_4 = '${col_4}',col_5 = '${col_5}' where id = ${id};`, function (error, result) {
        if (error) throw error;
    })
   

})

// delete data

app.get('/delete', function (req, res) {
    // console.log(req.body.colm1.length)
    // console.log(req.body.colm1[0])
    // var update = req.query.upd;
    var id = req.query.idd;
    // console.log(id)
    

    con.query(`update exel set isdelete = 1  where id = ${id};`, function (error, result) {
        if (error) throw error;
    })
   

})

//  insert  single data


app.get('/single_insert_exel', function (req, res) {
  
// console.log("inserted");

    // var arr = ['id'+q,'fname'+q,'lname'+q,'city'+q,'state'+q]
// console.log(arr);
// console.log("sanjayaaaa");
    var col_1 = req.query.sname;
    var col_2 = req.query.fname;
    var col_3 = req.query.lname;
    var col_4 = req.query.ccity;
    var col_5 = req.query.sstate;
    var del_6 = 0;

  

    con.query(`insert into exel (col_1,col_2,col_3,col_4,col_5,isdelete) values('${col_1}','${col_2}','${col_3}','${col_4}','${col_5}','${del_6}');`, function (error, result) {
        if (error) throw error;
        res.send({});
    })
   

})




app.listen(7900, function () {
    console.log('Node app is running on port 7900');
});
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






app.get('/combo',async function (req, res) {

    // console.log('sanjay parmar');
    var combo1 = await genratecombo(2, 'city');

    var combo2 = await genratecombo(3, 'state');
    var combo3 = await genratecombo(4, 'relation_status');
    var combo4 = await genratecombo(5, 'cource');

    var combo6 = await genratecombo(7, 'prefered_location');
    var combo7 = await genratecombo(8, 'department');
    var combo8 = await genratecombo(9, 'language');
    var combo9 = await genratecombo(10, 'technology');



    res.render("gen_combo.ejs", { combo1, combo2, combo3, combo4, combo6, combo7, combo8, combo9 });

});

var data = '';
function genratecombo(idd, comboname) {


    const data = new Promise((resolve, reject) => {
        con.query(`SELECT option_tag_value FROM option_master where s_id = ${idd};`, function (error, data1, fields) {
            if (error) throw error;

            //    console.log(data1)
            str = `<select name="${comboname}" id="${comboname}">`
            for (let i = 0; i < data1.length; i++) {
                str += `<option value=" ${data1[i].option_tag_value}"> ${data1[i].option_tag_value}</option>`
            }
            str += `</select>`
            resolve(str);

        })
    })
    
return data;
}

app.listen(6300, function () {
    console.log('Node app is running on port 6300');
});
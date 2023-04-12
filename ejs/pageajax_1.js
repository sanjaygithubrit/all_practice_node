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

// combo box

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
    con.query(`select * from state; `, function (error, data) {
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
        res.render('form2.ejs', { data2, data3, data4, data5, data7, data8, data9, data10 })
    })
})


//   submit data


app.post('/form', function (req, res) {

    // basic information
    var f_name = req.body.fname;
    var l_name = req.body.lname;
    var city = req.body.city;
    var state = req.body.state;
    var gender = req.body.male;
    var dob = req.body.dob;
    var contact_no = req.body.phone;
    var address_1 = req.body.add1;
    var address_2 = req.body.add2;
    var relation = req.body.relation;
    var zip_code = req.body.zip;
    var designation = req.body.desig;
    var email = req.body.email;
    var isdelete = 0;
    //   education
    var degree = req.body.education;
    var passing_year = req.body.cou_2;
    var percentage = req.body.cou_3;
    // work experience
    var company_name = req.body.work1;
    var company_position = req.body.work2;
    var start_date = req.body.work3;
    var end_date = req.body.work4;

    // language

    var language1 = req.body.language || 0;
    var read = req.body.read;
    var write = req.body.write;
    var speak = req.body.speak;

    // technology
    var tech_name = req.body.t1 || 0;
    var id;
    //  referance 
    var name1 = req.body.ref1;
    var contact_no1 = req.body.ref2;
    var relation1 = req.body.ref3;
    var name2 = req.body.ref4;
    var contact_no2 = req.body.ref5;
    var relation2 = req.body.ref6;
    // preferance
    var p_location = req.body.pre;
    var department = req.body.dep;
    var notice_p = req.body.notice;
    var c_ctc = req.body.current;
    var e_ctc = req.body.expect;

    console.log(req.body)
    // var rate = req.body.Nodejs;
    // console.log(tech_name)
    // var rate = [];

    //   console.log(abc)
    // basic information
    con.query(`insert into basic_information (f_name,l_name,city,state,gender,dob,contact_no,address_1,address_2,relation,zip_code,designation,email,isdelete) values('${f_name}','${l_name}','${city}','${state}','${gender}','${dob}','${contact_no}','${address_1}','${address_2}',"${relation}",'${zip_code}','${designation}','${email}','${isdelete}') ;`, function (error, data) {
        if (error) throw error;
        id = data.insertId;
        // con.query(`insert into reference (id,name,contact_no,relation) values('${id}','${name1}','${contact_no1}','${relation1}'),('${id}','${name2}','${contact_no2}','${relation2}');`, function (error, data) {
        //     if (error) throw error;
        // })
        // console.log(id);
        // })

        //   education

        if (typeof degree == "string") {
            con.query(`insert into education (id,degree,passing_year,percentage) values('${id}','${degree}','${passing_year}','${percentage}');`, function (error, data) {
                if (error) throw error;
                // console.log(data)
            })
        }
        else {

            for (let j = 0; j < degree.length; j++) {
                con.query(`insert into education (id,degree,passing_year,percentage) values('${id}','${degree[j]}','${passing_year[j]}','${percentage[j]}');`, function (error, data) {
                    if (error) throw error;
                    // console.log(data)
                })
            }
        }


        // work experience

        if (typeof company_name == "string") {
            con.query(`insert into experience (id,company_name,company_position,start_date,end_date) values('${id}','${company_name}','${company_position}','${start_date}','${end_date}');`, function (error, data) {
                if (error) throw error;
                // console.log(data)
            })

        }
        else {
            for (let k = 0; k < company_name.length; k++) {
                con.query(`insert into experience (id,company_name,company_position,start_date,end_date) values('${id}','${company_name[k]}','${company_position[k]}','${start_date[k]}','${end_date[k]}');`, function (error, data) {
                    if (error) throw error;
                    // console.log(data)
                })
            }
        }


        // language
        // if(typeof read == "string"){
        //     for (let p = 0; p<language1.length; p++) {
        //     con.query(`insert into language (id,l_lan,l_read,l_write,l_speak) values('${id}','${language1[p]}','${read.includes(language1)?'Yes':'No'}','${write.includes(language1)?'Yes':'No'}','${speak.includes(language1)?'Yes':'No'}');`, function (error, data) {
        //         if (error) throw error;
        //         // console.log(data)
        //     })
        // }
        // }
        // else{
        for (let p = 0; p < language1.length; p++) {
            con.query(`insert into language (id,l_lan,l_read,l_write,l_speak) values('${id}','${language1[p]}','${read.includes(language1[p]) ? 'Yes' : 'No'}','${write.includes(language1[p]) ? 'Yes' : 'No'}','${speak.includes(language1[p]) ? 'Yes' : 'No'}');`, function (error, data) {
                if (error) throw error;
                // console.log(data)
            })
        }
        // }

        // technology

        for (let i = 0; i < tech_name.length; i++) {
            con.query(`insert into technology (id,tech_name,rate) values("${id}","${tech_name[i]}","${req.body[tech_name[i]]}");`, function (error, data) {
                if (error) throw error;

            })
        }

        //  referance 
        con.query(`insert into reference (id,name,contact_no,relation) values('${id}','${name1}','${contact_no1}','${relation1}'),('${id}','${name2}','${contact_no2}','${relation2}');`, function (error, data) {
            if (error) throw error;
        })

        // preferance
        con.query(`insert into preferance (id,p_location,department,notice_p,c_ctc,e_ctc) values('${id}','${p_location}','${department}','${notice_p}','${c_ctc}','${e_ctc}');`, function (error, data) {
            if (error) throw error;
        })

    })
})



// searching

app.get('/sanjay', function (req, res) {
    var sanja = req.query.search || 1;

    if (sanja == 1 || '') {
        con.query(`SELECT * FROM basic_information where isdelete = 0 ;`, function (error, data1, fields) {
            if (error) throw error;


            res.render("search.ejs", { data: data1, sanja: '' });
        });
    }
    else {


        // console.log(sanja);
        var fname = "";
        var lname = "";
        var city = "";
        var state = "";
        var gender = "";
        var relation = "";
        var desig = "";

        for (i = 0; i <= sanja.length; i++) {
            if (sanja.charAt(i) == '^') {
                for (j = i + 1; j <= sanja.length; j++) {
                    if (sanja.charAt(j) == '+' || sanja.charAt(j) == '%' || sanja.charAt(j) == ',' || sanja.charAt(j) == ':' || sanja.charAt(j) == ';' || sanja.charAt(j) == '=') {
                        break;
                    }
                    else {
                        fname += sanja.charAt(j);
                    }
                }
                // console.log(sanja);
            }
            else if (sanja.charAt(i) == '%') {
                for (j = i + 1; j <= sanja.length; j++) {
                    if (sanja.charAt(j) == '^' || sanja.charAt(j) == ',' || sanja.charAt(j) == ':' || sanja.charAt(j) == ';' || sanja.charAt(j) == '+' || sanja.charAt(j) == '=') {
                        break;
                    }
                    else {
                        lname += sanja.charAt(j);
                    }

                }
            }
            else if (sanja.charAt(i) == ',') {
                for (j = i + 1; j <= sanja.length; j++) {
                    if (sanja.charAt(j) == '^' || sanja.charAt(j) == '%' || sanja.charAt(j) == ':' || sanja.charAt(j) == ';' || sanja.charAt(j) == '+' || sanja.charAt(j) == '=') {
                        break;
                    }
                    else {
                        city += sanja.charAt(j);
                    }

                }
            }
            else if (sanja.charAt(i) == ':') {
                for (j = i + 1; j <= sanja.length; j++) {
                    if (sanja.charAt(j) == '^' || sanja.charAt(j) == ',' || sanja.charAt(j) == '%' || sanja.charAt(j) == ';' || sanja.charAt(j) == '+' || sanja.charAt(j) == '=') {
                        break;
                    }
                    else {
                        state += sanja.charAt(j);
                    }

                }
            }
            else if (sanja.charAt(i) == ';') {
                for (j = i + 1; j <= sanja.length; j++) {
                    if (sanja.charAt(j) == '^' || sanja.charAt(j) == ',' || sanja.charAt(j) == ':' || sanja.charAt(j) == '%' || sanja.charAt(j) == '+' || sanja.charAt(j) == '=') {
                        break;
                    }
                    else {
                        gender += sanja.charAt(j);
                    }

                }
            }
            else if (sanja.charAt(i) == '=') {
                for (j = i + 1; j <= sanja.length; j++) {
                    if (sanja.charAt(j) == '^' || sanja.charAt(j) == ',' || sanja.charAt(j) == ':' || sanja.charAt(j) == ';' || sanja.charAt(j) == '+' || sanja.charAt(j) == '%') {
                        break;
                    }
                    else {
                        relation += sanja.charAt(j);
                    }

                }
            }
            else if (sanja.charAt(i) == '+') {
                for (j = i + 1; j <= sanja.length; j++) {
                    if (sanja.charAt(j) == '^' || sanja.charAt(j) == ',' || sanja.charAt(j) == ':' || sanja.charAt(j) == ';' || sanja.charAt(j) == '=' || sanja.charAt(j) == '%') {
                        break;
                    }
                    else {
                        desig += sanja.charAt(j);
                    }

                }
            }
        }
        con.query(`SELECT * FROM basic_information where f_name like '%${fname}%' AND l_name like '%${lname}%'AND city like '%${city}%'AND state like '%${state}%'AND gender like '%${gender}%'AND relation like '%${relation}%'AND designation like '%${desig}%';`, function (error, data1, fields) {
            if (error) throw error;
            res.render("pageajax_1.ejs", { data: data1, sanja });
        });


    }


});




app.get('/test-api', function (req, res) {

    let state_1 = req.query.state_id || "";
    //     if(state_1 ==""){
    // state_id = "";      
    //     }
    //     else{
    //         state_id= state_1;
    //     }
    console.log(state_1)
    con.query(`select city.city_name from city inner join state on city.state_id = state.state_id where state_name = '${state_1}';`, function (error, result) {
        if (error) throw error;
        // console.log(result)

        res.send(result);
        res.end();
    })
});

// delete record
app.get('/delete-api', function (req, res) {

    let del = req.query.del_1;
    console.log(del)
    con.query(`update basic_information set isdelete = 1 where id = ${del};`, function (error, result) {
        if (error) throw error;
    })

})


// delete multiple record


app.get('/deleteall-api', function (req, res) {

    let del_all = req.query.del_all;
    console.log(del_all)

    con.query(`update basic_information set isdelete = 1 where id in (${del_all});`, function (error, result) {
        if (error) throw error;
    })

})

// pagination 


app.get('/page_1', function (req, res) {

    var ajax = req.query.ajax || false;
    var pageno = req.query.page || 1;
    // console.log(ajax);
    var len = 5;
    var san = (pageno - 1) * len;

    var data;
    console.log(san)
    con.query(`SELECT * FROM basic_information limit ${san},${len}`, function (error, data, fields) {
        if (error) throw error;

        con.query(`SELECT count(id) as sanjay FROM basic_information `, function (error, data, fields) {
            if (error) throw error;
            // console.log(data123);
            var a = data[0].sanjay;
            var sanjay_1 = Math.ceil(a / 5);

            // var data_12 = sanjay_1

        });
        //  console.log(data)
        //  res.json({data})
        if (!ajax) {
            res.render("pageajax_1.ejs", { data });
        }
        else {
            res.send(data);
        }

    });


});


app.listen(5500, function () {
    console.log('Node app is running on port 5500');
});
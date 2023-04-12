var express = require('express');
var app = express();
app.use(express.json());
var ejs = require('ejs');
var http = require("http");
const bcrypt = require('bcrypt');
const util = require('util')
const swal = require('sweetalert');
const path = require("path")
// app.use(express.static('css'));
// app.use(express.static('images'));

var bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
var mysql = require('mysql2');
const { accessSyc } = require('fs');
const { endianness } = require('os');
const { table, log } = require('console');
var cookieParser = require('cookie-parser');
// app.use(cookieParser());
var jwt = require('jsonwebtoken')
app.use(cookieParser());
// const PORT=4040;


const staticpath = path.join(__dirname, '/public')
console.log(staticpath);
app.use(express.static(staticpath));



var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "jobapplication"
});

conn.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

});




var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'authentication'
});
con.connect((err) => {
    if (err) throw err;
    console.log(" database connected ")
});
app.set("view engine", "ejs");
app.get('/register', (req, res) => {

    res.render('register.ejs', {})
})
app.get('/login', (req, res) => {

    res.render('login.ejs', {})
})
// function for datab get from email universal 

async function Inemail(email) {
    return await new Promise((res, rej) => {
        con.query(`select * from registration where u_email='${email}';`, (err, data) => {
            if (err) throw err;
            res(data);
            // console.log(data.length);

        })
    })
}
app.post('/clone-email', (req, res) => {
    var email = req.body.email;
    con.query(`select * from registration where u_email='${email}';`, (err, data) => {
        if (err) throw err;
        // console.log(data);
        if (data.length == 0) {
            res.json(true)
        } else {
            res.json(false)
        }
    })

})
app.post('/email-validation', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    con.query(`select * from registration where u_email='${email}';`, (err, data) => {
        if (err) throw err;
        // console.log(data);
        if (data.length == 0) {
            res.json(true)
        } else {
            res.json(false)
        }
    })

})

app.post('/register', async (req, res) => {
    var user_name = req.body.user_name;
    var email = req.body.email;
    var password = req.body.password;
    var encrypt_password;
    var last_id;

    encrypt_password = await bcrypt.hash(password, 10);

    // console.log(encrypt_password);

    async function Inemail(email_exit) {
        return await new Promise((res, rej) => {
            con.query(`select u_email from registration where u_email='${email_exit}';`, (err, data) => {
                if (err) throw err;
                res(data);
            })
        })
    }
    // var email_data = await Inemail(email_data.email);
    var email_data = await Inemail(email);
    // console.log(email_data);
    let emailflag = 1;
    if (email_data.length == "") {
        emailflag = 0;
    } else {
        emailflag = 1;
    }
    //  console.log(emailflag);
    if (emailflag == 1) {

    }
    if (emailflag == 0) {
        var sql_insert = `insert into registration (u_name,u_email,u_password,isactive) values('${user_name}','${email}','${encrypt_password}','1');`
        con.query(sql_insert, (err, data) => {
            if (err) {
                console.log(err);
                res.send(err);
            }
            last_id = data.insertId;
            // console.log(last_id);
        });
        // payload = {email: email }
        // console.log(payload);
        const token = jwt.sign({ email: email }, 'sanjay');
        res.cookie("token", token);
        // console.log(token);
        res.redirect('/active');
    }

    else {
        // res.send('email already exit!.....')
        // console.log(res.json());

    };
})

app.get('/active', async (req, res) => {
    var jwttoken = req.cookies.token;
    var jwtdata = jwt.verify(jwttoken, "sanjay");
    // console.log(jwtdata);
    var email = jwtdata.email;

    var jwtdata = await Inemail(email);
    // console.log(jwtdata);

    res.render('active.ejs', { jwtdata })
})
app.post('/active-email', (req, res) => {
    var email = req.body.email;
    console.log("acsghf" + email);
    console.log('you email is active!.....................................')
    con.query(`update registration set isactive = '0' where u_email='${email}';`, (err, data) => {

        console.log(data);
    })
    res.redirect('/login');

})
app.post('/login', async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    var data = await Inemail(email);
    // console.log(data)

    if (data.length != 0) {
        async function compare_psw(password, data) {
            return await new Promise((res, rej) => {
                bcrypt.compare(password, data[0].u_password, (err, isMatch) => {
                    if (err) {
                        return err;
                    }
                    res(isMatch)
                    // console.log( "icompare" +isMatch);
                })
            })
        }
        var isMatch = await compare_psw(password, data);
        console.log(isMatch);
        if (isMatch == true) {
            console.log(data[0].isactive);
            // console.log(data);
            const token = jwt.sign({ email }, 'sanjay');
            // console.log("token!..........." ,token);
            res.cookie("token", token);
            console.log("active flag ....................................");
            // console.log(data[0].isactive);

            if (data[0].isactive == '1') {
                res.redirect('/active')
            } else {

                res.redirect('/home')
            }

        }
        else if (!isMatch) {
            return res.send(`Either email or password Wrong!..........<br><a href="/login"> Back to Login </a> `)

            //  res.redirect("/login")
            console.log('your password is nor matched ');
        }
    }
    else {
        // res.json(false)
        res.redirect('/login')
        console.log('your password is not matched ');
    }


});


app.get('/home', async (req, res) => {
    var jwttoken = req.cookies.token;
    if (jwttoken) {
        var jwtdata = jwt.verify(jwttoken, "sanjay");
        console.log(jwtdata);
        var email = jwtdata.email;
        var data = await Inemail(email);

        if(data[0].isactive==0){
            var jwtdata = await Inemail(jwtdata.email);
        console.log(jwtdata);
        res.render('home.ejs', { jwtdata })
        }
        else{

            res.send(`active your account!.............<a href="/active"> Click Here </a>`)
        }
        
    }
    else {
        res.send(`unauthorized user !......<a href="/login"> Login Here </a>`)
    }

})
app.get('/logout', (req, res) => {
    console.log("logput")
    res.clearCookie("token");
    res.redirect('/login');
})






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
    conn.query(`select option_tag_value from option_master where s_id = 2`, function (error, data) {
        if (error) throw error;
        data2 = data;
        // console.log(data)
        // console.log(data1);

    })
    conn.query(`select * from state; `, function (error, data) {
        if (error) throw error;
        data3 = data;

    })
    conn.query(`select option_tag_value from option_master where s_id = 4`, function (error, data) {
        if (error) throw error;
        data4 = data;

    })
    conn.query(`select option_tag_value from option_master where s_id = 5`, function (error, data) {
        if (error) throw error;
        data5 = data;

    })
    conn.query(`select option_tag_value from option_master where s_id = 7`, function (error, data) {
        if (error) throw error;
        data7 = data;

    })
    conn.query(`select option_tag_value from option_master where s_id = 8`, function (error, data) {
        if (error) throw error;
        data8 = data;

    })
    conn.query(`select option_tag_value from option_master where s_id = 9`, function (error, data) {
        if (error) throw error;
        data9 = data;

    })
    conn.query(`select option_tag_value from option_master where s_id = 10`, function (error, data) {
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

    var language1 = req.body.language ||0;
    var read = req.body.read;
    var write = req.body.write;
    var speak = req.body.speak;

// technology
    var tech_name = req.body.t1 ||0;
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
    conn.query(`insert into basic_information (f_name,l_name,city,state,gender,dob,contact_no,address_1,address_2,relation,zip_code,designation,email,isdelete) values('${f_name}','${l_name}','${city}','${state}','${gender}','${dob}','${contact_no}','${address_1}','${address_2}',"${relation}",'${zip_code}','${designation}','${email}','${isdelete}') ;`, function (error, data) {
        if (error) throw error;
        id = data.insertId;
        // con.query(`insert into reference (id,name,contact_no,relation) values('${id}','${name1}','${contact_no1}','${relation1}'),('${id}','${name2}','${contact_no2}','${relation2}');`, function (error, data) {
        //     if (error) throw error;
        // })
        // console.log(id);
        // })

//   education

if(typeof degree == "string"){
    con.query(`insert into education (id,degree,passing_year,percentage) values('${id}','${degree}','${passing_year}','${percentage}');`, function (error, data) {
        if (error) throw error;
        // console.log(data)
    })
}
else{

    for (let j = 0; j < degree.length; j++) {
        con.query(`insert into education (id,degree,passing_year,percentage) values('${id}','${degree[j]}','${passing_year[j]}','${percentage[j]}');`, function (error, data) {
            if (error) throw error;
            // console.log(data)
        })
    }
}


// work experience

if(typeof company_name == "string"){
    con.query(`insert into experience (id,company_name,company_position,start_date,end_date) values('${id}','${company_name}','${company_position}','${start_date}','${end_date}');`, function (error, data) {
        if (error) throw error;
        // console.log(data)
    })

}
else{
    for (let k = 0; k < company_name.length; k++) {
        con.query(`insert into experience (id,company_name,company_position,start_date,end_date) values('${id}','${company_name[k]}','${company_position[k]}','${start_date[k]}','${end_date[k]}');`, function (error, data) {
            if (error) throw error;
            // console.log(data)
        })
    }
}
       

// language

if(language1 == undefined){
    language1=[];
}
if(read == undefined){
    read=[];
}
if(write == undefined){
    write=[];
};
if(speak == undefined){
    speak=[];
}

    if(typeof language1 == "object"){
    for (let p = 0; p<language1.length; p++) {
        con.query(`insert into language (id,l_lan,l_read,l_write,l_speak) values('${id}','${language1[p]}','${read.includes(language1[p])?'Yes':'No'}','${write.includes(language1[p])?'Yes':'No'}','${speak.includes(language1[p])?'Yes':'No'}');`, function (error, data) {
            if (error) throw error;
            // console.log(data)
        })
    }
}else{

 conn.query(`insert into language (id,l_lan,l_read,l_write,l_speak) values('${id}','${language1}','${read.includes(language1)?'Yes':'No'}','${write.includes(language1)?'Yes':'No'}','${speak.includes(language1)?'Yes':'No'}');`, function (error, data) {
            if (error) throw error;
            // console.log(data)
        })
}

       
// technology
if(tech_name == undefined){
    tech_name =[];

}
let tech_arry = Array.isArray(tech_name);
if(tech_arry == true){
        for (let i = 0; i < tech_name.length; i++) {
            conn.query(`insert into technology (id,tech_name,rate) values("${id}","${tech_name[i]}","${req.body[tech_name[i]]}");`, function (error, data) {
                if (error) throw error;

            })
        }
    }else{
        conn.query(`insert into technology (id,tech_name,rate) values("${id}","${tech_name}","${req.body[tech_name]}");`, function (error, data) {
            if (error) throw error;

        })

    }

//  referance 
        conn.query(`insert into reference (id,name,contact_no,relation) values('${id}','${name1}','${contact_no1}','${relation1}'),('${id}','${name2}','${contact_no2}','${relation2}');`, function (error, data) {
            if (error) throw error;
        })

// preferance
        conn.query(`insert into preferance (id,p_location,department,notice_p,c_ctc,e_ctc) values('${id}','${p_location}','${department}','${notice_p}','${c_ctc}','${e_ctc}');`, function (error, data) {
            if (error) throw error;
        })

    })
})



// searching

app.get('/sanjay', function (req, res) {
    var sanja = req.query.search || 1 ;

    if (sanja == 1 || '') {
        conn.query(`SELECT * FROM basic_information where isdelete = 0 ;`, function (error, data1, fields) {
            if (error) throw error;


            res.render("search.ejs", { data: data1 ,sanja:''});
        });
    }
    else{


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
        conn.query(`SELECT * FROM basic_information where f_name like '%${fname}%' AND l_name like '%${lname}%'AND city like '%${city}%'AND state like '%${state}%'AND gender like '%${gender}%'AND relation like '%${relation}%'AND designation like '%${desig}%';`, function (error, data1, fields) {
            if (error) throw error;
            res.render("search.ejs", { data: data1 ,sanja });
        });

      
    }


});




app.get('/test-api',function(req,res){

    let state_1 = req.query.state_id ||"";
//     if(state_1 ==""){
// state_id = "";      
//     }
//     else{
//         state_id= state_1;
//     }
    console.log(state_1)
    conn.query(`select city.city_name from city inner join state on city.state_id = state.state_id where state_name = '${state_1}';`,function(error,result){
        if (error) throw error;
        // console.log(result)
      
        res.send(result);
        res.end();
    })
});

// delete record
app.get('/delete-api',function(req,res){

let del = req.query.del_1;
console.log(del)
conn.query(`update basic_information set isdelete = 1 where id = ${del};`,function(error,result){
    if (error) throw error;
})

})


// delete multiple record


app.get('/deleteall-api',function(req,res){

    let del_all = req.query.del_all;
    console.log(del_all)
  
    conn.query(`update basic_information set isdelete = 1 where id in (${del_all});`,function(error,result){
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
        conn.query(`SELECT * FROM basic_information limit ${san},${len}`, function (error, data, fields) {
            if (error) throw error;
    
            conn.query(`SELECT count(id) as sanjay FROM basic_information `, function (error, data, fields) {
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






app.listen(5800, () => {
    console.log("app listion on 5800 port");
})

// for refrencve
// <h1>
//         Active your Account......
//     </h1>

//     <form method="POST" action="/login">
//         Name : <p>
//             <%=jwtdata[0].user_name%>
//         </p>
//         Email : <p id="email">
//             <%=jwtdata[0].email%>
//         </p>

//         <a onclick="active()" href="/login"> Active Your Account </a>
//     </form>
var express = require('express');
var app = express();
app.use(express.json());
var ejs = require('ejs');
var http = require("http");
const bcrypt = require('bcrypt');
const util = require('util')
const swal = require('sweetalert');

app.use(express.static('css'));
app.use(express.static('images'));

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
    // if (emailflag == 1) {

    // }
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

app.listen(5700, () => {
    console.log("app listion on 5700 port");
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
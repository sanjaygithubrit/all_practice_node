var express = require('express');
var app = express();


// Set EJS as templating engine
app.set('view engine', 'ejs');


app.get('/hell', function (req, res) {


    res.render('hello', { message: "hello word1!" });

});

app.listen(5050, function () {
    console.log('Node app is running on port 5050');
});
const express = require("express");
const dummy_array = ["sanjay", "jaydip", "dhaval", "hiren"];
const dummy_variable = "This is dummy var";
const app = express();
app.set("view engine", "ejs"); 

app.get("/", (req, res) => {
    res.render("sanjay", {array_data: dummy_array, variable_data: dummy_variable}); 
})

app.listen(5500, (req, res) => console.log("App is running"));


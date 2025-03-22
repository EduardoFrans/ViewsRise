const mysql= require("mysql") 
const dotenv = require("dotenv")

 const db = mysql.createConnection({
    host: "localhost",
    user: "Frans",
    password:"26042003",
    database: "viewsrise"

})
module.exports = db
db.connect(function(err) {
    if (err) throw err;
    console.log("Connec!");
  });
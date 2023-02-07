const express = require('express')
const app = express();
const cors = require("cors");

//middleware
app.use(express.json()) //req.body
app.use(cors())

//Routes

//sign up and sign 
app.use("/auth", require("./routes/jwtAuth"))
// dashboard 
app.use("/dashboard", require("./routes/dashboard"));
app.listen(5000,  () => {
  console.log ("Server is running on the port 5000");
});
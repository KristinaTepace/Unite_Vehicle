const router = require("express").Router()
const pool = require("../db")
const bcrypt = require("bcrypt")
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

//register route
router.post("/register", validInfo, async(req, res) =>{
    try{

        //destructure the req.body(name, email, password)
        const {name, email, password} = req.body; 

        //check if user exist(if user is exist then throw error)
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
            email
        ]);

        if(user.rows.length !== 0){
            return res.status(401).json("User already exist");
        }

        //bycrypt the user password
        const saltRound = 10; 
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        //enter the new user inside our database
        const newUser = await pool.query("INSERT INTO users(user_name,user_email,user_password) VALUES($1, $2, $3) RETURNING *",
         [name, email, bcryptPassword]
         );
       

        //generating our jwt token
        const token = jwtGenerator(newUser.rows[0].user_id);
        res.json( { token } );
    }
    catch (err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


// login route
router.post("/login", validInfo, async (req, res) => {
    try{
        //destructure the req.body
        const {email, password} = req.body;

        //check if user doesn't exist (if not then throw error)
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
            email
        ]);

        if (user.rows.length === 0) {
            return res.status(401).json("Invalid Credentials");
        }


        //check if incoming password  is the same the  database password
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

        if (!validPassword) {
            return res.status(401).json("Invalid Credential");
        }

        //give the jwt token
        const jwtToken = jwtGenerator(user.rows[0].user_id);
            return res.json({ jwtToken });
    }

    catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }

});

// verify route
router.get("/verify", authorization, async (req, res) => {
    try {
      res.json(true);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  });
module.exports = router;

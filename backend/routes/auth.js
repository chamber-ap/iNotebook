const express = require('express');
const User = require('../models//User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = 'Harryisamadar$boy';

//--ROUTE1: create a user : POST '/api/auth/createuser' : no login required
router.post('/createuser',[
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    // username must be an email
    body('email', 'Enter a valid mail').isEmail(),
    // password must be at least 5 chars long
    body('password', 'Password must be atleast 5 characters').isLength({ min: 6 }),
], async (req, res)=>{
    let success = false;
    //if there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success,  errors: errors.array() });
    }
    try{
        // Check whether the user with same email exist already

    
    let user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({success, error: "Sorry! a user with this email already exist"})
    }

    const salt = await bcrypt.genSaltSync(10);
    const secPass = await bcrypt.hashSync(req.body.password, salt);
    // Store hash in your password DB.
    //creates a user

    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      })

    //synchronous sign 
    const data = {
        user:{
            id: user.id
        }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    
    // res.json(user)
    success = true;
    res.json({success, authToken});
      
    //   .then(user => res.json(user))
    //   .catch(err=>{console.log(err)
    // res.json({error: 'Please enter a unique mail-ID', message: err.message})});
    // // res.send(req.body) --no need as we are doing res.json
} catch (error) {
     console.error(error.message); //Ideally we send that in  Logger SQS
     res.status(500).send("Internal Server Error") ;  
} 
})


//---ROUTE2: Endpoint to: Authenticate a User using: POST "/api/auth/login" . No login required  
router.post('/login', [ 
    body('email', 'Enter a valid mail').isEmail(), //isRmail and exists are validation checks
    body('password', 'Password cannot be blank').exists(),
], async (req, res)=>{
    let success = false;

    //if there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //Destructuring method of js
    const {email, password} = req.body; //email and passwords are now in body
    try{
        //Find the user in db with the entered email
        let user = await User.findOne({email}); //it return t/f 
        if(!user){
            success= false;
            return res.status(400).json({error: "Plaese try to login with correct credentials"});
        }

        //compare the passwords
        const passwordcompare = await bcrypt.compare(password, user.password);
        //and the if the password is invalid than show the error
        if(!passwordcompare){
            success = false;
            return res.status(400).json({success, error: "Plaese try to login with correct credentials"});
        }


        //Payload sending if both passwords were matched
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken});


    } catch (error) {
        console.error(error.message); 
        res.status(500).send("Internal Server Error"); 
    }

}
)

//ROUTE3: get loggedin user details using: POST "/api/auth/getuser". Login required 
router.post('/getuser', fetchuser , async (req, res) =>{

    try{
        userID = req.user.id;
        const user = await User.findById(userID).select("-password") 
        res.send(user);
    } catch (error){
        console.error(error.message); 
        res.status(500).send("Internal Server Error"); 
    }
})

module.exports = router;
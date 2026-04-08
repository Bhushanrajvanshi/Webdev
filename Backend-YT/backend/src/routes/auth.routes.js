const express = require("express");
const router = express.Router();

const authControllers = require("../controllers/auth.controller");


/* POST - api/auth/register */ 
router.post("/register", authControllers.userRegisterController);

/* POST - api/auth/login */
router.post("/login", authControllers.userLoginController); 


module.exports = router;
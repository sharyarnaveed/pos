const {Router}=require("express");
const { health, authcheck, logout } = require("../controller/health.controller");
const { signin } = require("../controller/signin.controller");




const router=Router();


router.route("/healthcheck").get(health)
router.route("/signin").post(signin)
router.route("/authcheck").get(authcheck)
router.route("/logout").post(logout)




module.exports=router
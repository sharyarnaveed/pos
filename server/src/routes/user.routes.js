const {Router}=require("express");
const { health, authcheck, logout } = require("../controller/health.controller");
const { signin } = require("../controller/signin.controller");
const { AddCustomers, viewCustomers } = require("../controller/customer.controller");
const { requireAuth } = require("../middlewares/auth.middleware");




const router=Router();


router.route("/healthcheck").get(health)
router.route("/signin").post(signin)
router.route("/authcheck").get(authcheck)
router.route("/logout").post(logout)
router.route("/addcustomer").post(AddCustomers)
router.route("/viewcustomer").get(viewCustomers)




module.exports=router
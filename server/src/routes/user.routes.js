const {Router}=require("express");
const { health, authcheck, logout } = require("../controller/health.controller");
const { signin } = require("../controller/signin.controller");
const { AddCustomers, viewCustomers } = require("../controller/customer.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const {addDriver, viewDriver} = require("../controller/driver.controller");




const router=Router();


router.route("/healthcheck").get(health)
router.route("/signin").post(signin)
router.route("/authcheck").get(authcheck)
router.route("/logout").post(requireAuth,logout)
router.route("/addcustomer").post( requireAuth, AddCustomers)
router.route("/viewcustomer").get( requireAuth, viewCustomers)
router.route("/adddriver").post(requireAuth,addDriver)
router.route("/viewdriver").get(requireAuth,viewDriver)





module.exports=router
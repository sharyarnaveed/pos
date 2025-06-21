const {Router}=require("express");
const { health, authcheck, logout } = require("../controller/health.controller");
const { signin } = require("../controller/signin.controller");
const { AddCustomers, viewCustomers } = require("../controller/customer.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const {addDriver, viewDriver} = require("../controller/driver.controller");
const { addvehicle, viewvehicle } = require("../controller/vehicle.controller");
const { addOrder, viewOrder, editorder } = require("../controller/order.controller");
const { addexpences, viewexpences, addExpencebalance } = require("../controller/expences.controller");
const { signup } = require("../controller/signup.controller");




const router=Router();


router.route("/healthcheck").get(health)
router.route("/signin").post(signin)
router.route("/signup").post(signup)

router.route("/authcheck").get(authcheck)
router.route("/logout").post(requireAuth,logout)
router.route("/addcustomer").post( requireAuth, AddCustomers)
router.route("/viewcustomer").get( requireAuth, viewCustomers)
router.route("/adddriver").post(requireAuth,addDriver)
router.route("/viewdriver").get(requireAuth,viewDriver)
router.route("/addvehicle").post(requireAuth,addvehicle)
router.route("/viewvehicle").get(viewvehicle)
router.route("/addorder").post(requireAuth,addOrder)
router.route("/vieworders").get(requireAuth,viewOrder)
router.route("/updateorder/:id").put(editorder)
router.route("/addexpence").post(addexpences)
router.route("/viewexpences").get(viewexpences)
router.route("/addamount").post(addExpencebalance)









module.exports=router
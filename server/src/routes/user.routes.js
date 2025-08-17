const {Router}=require("express");
const { health, authcheck, logout } = require("../controller/health.controller");
const { signin } = require("../controller/signin.controller");
const { AddCustomers, viewCustomers, customerpayment, updateCustomer } = require("../controller/customer.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const {addDriver, viewDriver, DriverReport, updateDriver} = require("../controller/driver.controller");
const { addvehicle, viewvehicle, updateVehicle } = require("../controller/vehicle.controller");
const { addOrder, viewOrder, editorder, vieworderBycustomerId } = require("../controller/order.controller");
const { addexpences, viewexpences, addExpencebalance, gettotalexpenceandbalance, getbalancehistory, editexpences } = require("../controller/expences.controller");
const { signup } = require("../controller/signup.controller");
const { paymentadd } = require("../controller/payment.controller");
const { getDashboardData } = require("../controller/dashboard.controlleer");
const {
  addMechanic,
  viewMechanics,
  updateMechanic,
  deleteMechanic,
} = require("../controller/maintainance.controller");
const {
  addFuelStation,
  viewFuelStations,
  updateFuelStation,
  deleteFuelStation,
} = require("../controller/fuel.controller");
const { saveinvoice, getInvoices } = require("../controller/invoice.controller");



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
router.route("/updateorder/:id").put(requireAuth,editorder)
router.route("/addexpence").post(requireAuth,addexpences)
router.route("/viewexpences").get(requireAuth,viewexpences)
router.route("/addamount").post(requireAuth,addExpencebalance)
router.route("/gettoalexpncebalance").get(requireAuth,gettotalexpenceandbalance)
router.route("/getbalancehistory").get(requireAuth,getbalancehistory)
router.route("/addpayment/:id").put(requireAuth,paymentadd)
router.route("/customerdata/:customerid").get(requireAuth,vieworderBycustomerId)
router.route("/dashboard").get(requireAuth,getDashboardData);
router.route("/driverreport/:id").get(requireAuth,DriverReport);
router.route("/paymentreport/:customerid").get(customerpayment);
router.route("/updatecustomer/:id").put(requireAuth, updateCustomer);
router.route("/updatedriver/:id").put(requireAuth, updateDriver);
router.route("/updatevehicle/:id").put(requireAuth, updateVehicle);
router.put('/editexpence/:id', editexpences);
router.post("/addmechanic", addMechanic);
router.get("/viewmechanic", viewMechanics);
router.put("/updatemechanic/:id", updateMechanic);
router.delete("/deletemechanic/:id", deleteMechanic);
router.route("/addfuelstation").post(requireAuth, addFuelStation);
router.route("/viewfuelstation").get(requireAuth, viewFuelStations);
router.route("/updatefuelstation/:id").put(requireAuth, updateFuelStation);
router.route("/deletefuelstation/:id").delete(requireAuth, deleteFuelStation);

router.route("/saveinvoice").post(requireAuth, saveinvoice);
router.route("/viewinvoices").get(requireAuth, getInvoices);

module.exports=router
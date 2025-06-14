const Driver = require("../models/Driver.model");

const addDriver = async (req, res) => {
  try {
    const { drivername, driverphoneno } = req.body;
    console.log(drivername, driverphoneno);

    const save = Driver.create({
      drivername,
      driverphoneno,
    });

    if (save) {
      return res.json({
        message: " Added Driver",
        success: true,
      });
    } else {
      return res.json({
        message: "error in adding driver",
        success: false,
      });
    }
  } catch (error) {
    console.log("error in adding driver", error);
    return res.json({
      message: error.errors[0].message || "error in adding driver",
      success: false,
    });
  }
};

const viewDriver= async(req,res)=>
{
    try {
        
const DriverData=await Driver.findAll({
    raw:true
})
res.json({
    success:true,
    DriverData:DriverData
})
    } catch (error) {
        console.log("error in getting customers",error)
    }
}








module.exports = {addDriver,viewDriver};

const Vehicle = require("../models/Vehicle.model");

const addvehicle = async (req, res) => {
  try {
    const { plateNumber, type, fuelType } = req.body;

    const save = await Vehicle.create({
      plateNumber,
      type,
      fuelType,
    });

    if (save) {
      return res.json({
        message: "Vehicle saved",
        success: true,
      });
    } else {
      return res.json({
        message: "error in adding vehicle",
        success: false,
      });
    }
  } catch (error) {
    console.log("error in adding vehicles", error);
     return res.json({
      message: error.errors[0].message||"error in adding vehicle",
      success: false,
    });
  }
};

const viewvehicle= async (req,res)=>
{
  try {
    const vehicledata=await Vehicle.findAll({
    raw:true
})
return res.json({
    success:true,
    VehicleData:vehicledata
})

  } catch (error) {
       return res.json({
      message: "error in viewing vehicle",
      success: false,
    });
  }
}

module.exports={addvehicle,viewvehicle}
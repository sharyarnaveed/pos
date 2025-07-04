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

const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { plateNumber, type, fuelType } = req.body;

    console.log("Updating vehicle:", id, req.body);

    if (!plateNumber || !type || !fuelType) {
      return res.json({
        message: "Plate number, type, and fuel type are required",
        success: false,
      });
    }

    const existingVehicle = await Vehicle.findByPk(id);
    if (!existingVehicle) {
      return res.json({
        message: "Vehicle not found",
        success: false,
      });
    }

    // Check if plate number already exists for another vehicle
    const plateExists = await Vehicle.findOne({
      where: {
        plateNumber: plateNumber,
        id: id  // Exclude current vehicle
      }
    });

    if (plateExists) {
      return res.json({
        message: "Vehicle with this plate number already exists",
        success: false,
      });
    }

    const [updatedRows] = await Vehicle.update(
      {
        plateNumber,
        type,
        fuelType,
  
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (updatedRows > 0) {
      return res.json({
        message: "Vehicle updated successfully",
        success: true,
      });
    } else {
      return res.json({
        message: "Vehicle update failed",
        success: false,
      });
    }
  } catch (error) {
    console.log("error in updating vehicle", error);
    return res.json({
      message: error.errors?.[0]?.message || "error in updating vehicle",
      success: false,
    });
  }
};

module.exports={addvehicle,viewvehicle,updateVehicle}
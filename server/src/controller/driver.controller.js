const { where } = require("sequelize");
const Driver = require("../models/Driver.model");
const Order = require("../models/order.model");
const Vehicle = require("../models/Vehicle.model");
const Customer = require("../models/Customer.model");

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


const DriverReport= async (req,res)=>
{
        try {
        const {id}=req.params
        console.log(id);
        
const OrderData=await Order.findAll({
    raw:true,
    include:[
      {
        model:Vehicle,
        as: 'vehicleDetails'
      },
      {
        model:Driver,
        as:"driverDetails"
      },
      {
        model:Customer,
        as:"CustomerDetails"
      }
    ],
    where:{
        driver:id
    },
    order: [['createdAt', 'DESC']]
})

res.json({
    success:true,
    OrderData:OrderData
})
    } catch (error) {
        console.log("error in getting orders",error)
        res.json({
            success:false,
            message:"Error fetching driver report"
        })
    }
}

const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { drivername, driverphoneno } = req.body;

    console.log("Updating driver:", id, req.body);

    if (!drivername || !driverphoneno) {
      return res.json({
        message: "All values required",
        success: false,
      });
    }

    const existingDriver = await Driver.findByPk(id);
    if (!existingDriver) {
      return res.json({
        message: "Driver not found",
        success: false,
      });
    }

    const [updatedRows] = await Driver.update(
      {
        drivername,
        driverphoneno,
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (updatedRows > 0) {
      return res.json({
        message: "Driver updated successfully",
        success: true,
      });
    } else {
      return res.json({
        message: "Driver update failed",
        success: false,
      });
    }
  } catch (error) {
    console.log("error in updating driver", error);
    return res.json({
      message: error.errors?.[0]?.message || "error in updating driver",
      success: false,
    });
  }
};

module.exports = { addDriver, viewDriver, DriverReport, updateDriver };

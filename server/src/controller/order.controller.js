const Customer = require("../models/Customer.model.js");
const Driver = require("../models/Driver.model.js");
const Order = require("../models/order.model");
const Vehicle = require("../models/Vehicle.model.js");

const addOrder = async (req, res) => {
  try {
    const {
      from,
      to,
      containerNumber,
      customerId,
      rate,
      token,
      custWash,
      merc,
      extra,
      driverId,
      vehicleId,
      remarks,
      orderType,
      total
    } = req.body;

    const save = await Order.create({
      from,
      to,
      containerNumber,
      customer: customerId,
      rate,
      token,
      custWash,
      merc,
      extra,
      driver: driverId,
      vehicle: vehicleId,
      remarks,
      type: orderType,
      total
    });

    if (save) {
      return res.json({
        message: "Data saved",
        success: true,
      });
    } else {
      return res.json({
        message: "Data Not saved",
        success: false,
      });
    }
  } catch (error) {
    console.log("error in adding order", error);
    return res.json({
      message: error.errors[0].message || "Data Not saved",
      success: false,
    });
  }
};


const viewOrder= async (req,res)=>
{
        try {
        
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
    order: [['createdAt', 'DESC']]
})
res.json({
    success:true,
    OrderData:OrderData
})
    } catch (error) {
        console.log("error in getting orders",error)
    }
}


module.exports = { addOrder,viewOrder };

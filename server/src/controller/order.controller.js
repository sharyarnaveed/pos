const { raw } = require("mysql2");
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
      total,
      vat,
      orderDate,
      extraChargeType
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
      total,
      vat,
      date:orderDate,
      extratype:extraChargeType
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


const editorder=async(req,res)=>
{
  try {
 const {id}=req.params
   const {
      rate,
        token,
        custWash,
        merc,
        extra,
        remarks,
 orderDate,
      extraChargeType,
        total
    } = req.body;
    console.log(   rate,
        token,
        custWash,
        merc,
        extra,
        remarks,

        total);
    

    const existingOrder=await Order.findByPk(id);
    if(!existingOrder)
    {
         return res.json({
        message: "Order not found",
        success: false,
      });
    }


    const [updateorder]=await Order.update(
      {

        rate,
        token,
        custWash,
        merc,
        extra,
        remarks,
date:orderDate,
      extratype:extraChargeType,
        total
      },
      {
        where:{
          id:id
        }
      }
    )

    if (updateorder > 0) {
      return res.json({
        message: "Order updated successfully",
        success: true,
      });
    } else {
      return res.json({
        message: "Order not updated",
        success: false,
      });
    }
    
  } catch (error) {
   console.log("error in updating order", error);
    return res.json({
      message: error.message || "Order not updated",
      success: false,
    });
  }
}




const vieworderBycustomerId=async(req,res)=>
{
  try {
    const {customerid}=req.params;
    
    const data= await Order.findAll({
      where:{
        customer:customerid
      },
      raw:true
    })
    



if (data) {
  const customerData=await Customer.findByPk(customerid,{raw:true})

  return res.json({
    success:true,
    customerData:data,
    customerInfo:customerData
  })
}
else{
  return res.json({
    success:false
  })
}

  } catch (error) {
        console.log("error in getting orders",error)
    
  }
}
module.exports = { addOrder,viewOrder,editorder,vieworderBycustomerId };

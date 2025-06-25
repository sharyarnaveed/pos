const Order = require("../models/order.model");

const paymentadd = async (req, res) => {
  try {
    const { amount } = req.body;
    const { id } = req.params;
    let paidstatus = false;
    if (!amount || !id) {
      return res.json({
        message: "Please provide amount and order id",
        success: false,
      });
    }

    const existingOrder = await Order.findByPk(id);
    console.log("Existing Order:", existingOrder.dataValues);

    const previouspayed = existingOrder.dataValues.paidamount;
    const updatedpaymed = previouspayed + amount;

    if (existingOrder.dataValues.total == updatedpaymed) {
      paidstatus = true;
    } else {
      paidstatus = false;
    }

    const update = await Order.update(
      {
        paidamount: updatedpaymed,
        paidstatus: paidstatus,
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (!update) {
      return res.json({
        message: "Cannot update Payment",
        success: false,
      });
    }

    return res.json({
      message: "Payment Added Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      message: "Cannot add Payment",
      success: false,
    });
  }
};
module.exports = {
  paymentadd,
};

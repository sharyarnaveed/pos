const Order = require("../models/order.model");

const paymentadd = async (req, res) => {
  try {
    const { amount } = req.body;
    const { id } = req.params;
    
    if (!amount || !id) {
      return res.json({
        message: "Please provide amount and order id",
        success: false,
      });
    }

    const existingOrder = await Order.findByPk(id);
    
    if (!existingOrder) {
      return res.json({
        message: "Order not found",
        success: false,
      });
    }
    console.log("Existing Order:", existingOrder.dataValues);
    const previouspayed = parseFloat(existingOrder.dataValues.paidamount) || 0;
    const paymentAmount = parseFloat(amount);
    const updatedpaymed = previouspayed + paymentAmount;
    const totalAmount = parseFloat(existingOrder.dataValues.total);
    const paidstatus = Math.round(updatedpaymed * 100) >= Math.round(totalAmount * 100);
    console.log(`Previous: ${previouspayed}, Payment: ${paymentAmount}, Updated: ${updatedpaymed}, Total: ${totalAmount}, Status: ${paidstatus}`);
    const update = await Order.update(
      {
        paidamount: updatedpaymed,
        paidStatus: paidstatus,
      },
      {
        where: {
          id: id,
        },
      }
    );
    if (update[0] === 0) {
      return res.json({
        message: "Cannot update Payment - no rows affected",
        success: false,
      });
    }
    return res.json({
      message: "Payment Added Successfully",
      success: true,
      data: {
        paidAmount: updatedpaymed,
        totalAmount: totalAmount,
        paidStatus: paidstatus
      }
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

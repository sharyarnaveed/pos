const Currentbalance = require("../models/balance.model");
const BalanceHistory = require("../models/balancehistory.model");
const Expences = require("../models/expences.model");
const Vehicle = require("../models/Vehicle.model");
const { Sequelize } = require("sequelize");
const addexpences = async (req, res) => {
  try {
    const { description, amount, category, vehicleId, remarks, date, quantity, dhs, fills, fuelStation,billInvoice } = req.body;

    const save = await Expences.create({
      description,
      amount,
      category,
      vehicle: vehicleId,
      remarks,
      date,
      quantity: category === "Fuel" ? quantity : null,
      dhs: category === "Fuel" ? dhs : null,
      fills: category === "Fuel" ? fills : null,
      fuelStation: category === "Fuel" ? fuelStation : null,
      billInvoice
    });

    if (save) {
      const oldbalance = await Currentbalance.findAll({
        raw: true
      });

      const previousbalance = oldbalance[0].balance;
      const updatedbalance = previousbalance - amount;

      const updatebalance = await Currentbalance.update(
        {
          balance: updatedbalance,
        }, {
          where: {
            id: oldbalance[0].id,
          },
        }
      );

      if (!updatebalance) {
        return res.json({
          message: "Error in updating balance",
          success: false,
        });
      }

      return res.json({
        message: "Expense added successfully",
        success: true,
      });

    } else {
      return res.json({
        message: "Error in adding expense",
        success: false,
      });
    }
  } catch (error) {
    console.log("error in adding expense", error);
    return res.json({
      message: error.errors?.[0]?.message || "Error in adding expense",
      success: false,
    });
  }
};

const viewexpences = async (req, res) => {
  try {
    console.log("Starting to fetch expenses...");
    
    const expenceData = await Expences.findAll({
      raw: true,
      include: [
        {
          model: Vehicle,
          as: "vehicleDetails",
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    
    console.log("Expenses fetched successfully:", expenceData.length);
    
    const expenceCount = await Expences.findAll({
      attributes: [
        "vehicle",
        [Sequelize.fn("COUNT", Sequelize.col("expences.id")), "expenseCount"], // Specify table name
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"],
      ],
      include: [
        {
          model: Vehicle,
          as: "vehicleDetails",
        },
      ],
      group: ["vehicle", "vehicleDetails.id"],
      raw: true,
    });

    return res.json({
      success: true,
      expenceData: expenceData,
      expenceCount: expenceCount,
    });
  } catch (error) {
    console.log("Detailed error in viewing expenses:", error);
    console.log("Error message:", error.message);
    console.log("Error stack:", error.stack);
    return res.json({
      message: "Error in viewing expenses",
      success: false,
      error: error.message // Add this for debugging
    });
  }
};


const addExpencebalance =async (req,res)=>
{
  try {
    
const {amount,description,vehicleId}=req.body
console.log(amount,description);

const getamount=await Currentbalance.findAll({
  raw:true
})

console.log(getamount[0].balance);
const previousbalance = parseFloat(getamount[0].balance)
const updatedbalance = previousbalance + parseFloat(amount)

console.log(updatedbalance);

if(getamount.length<0)
{
  return res.json({
    message: "No balance found",
    success: false,
  });
}

const updatebalance= await Currentbalance.update({
  balance:updatedbalance
},
{
  where:{
    id:getamount[0].id
  }
})


if(!updatebalance)
{
  return res.json({
    message: "Error in updating balance",
    success: false,
  });

}

const savehistory= await BalanceHistory.create({
balance:amount,
description:description
})

if(savehistory)
{
  return res.json({
    message: "Expense balance added successfully",
    success: true,
  });
}
return res.json({
  message: "Error in adding expense balance",
  success: false,
});

  } catch (error) {
  console.log("error in adding expences balance", error);
    return res.json({
      message: "Error in adding expences balance",
      success: false,
    });
  }
}


const gettotalexpenceandbalance=async(req,res)=>
{
try {
const totalExpence = await Expences.findAll({
  attributes: [
    [Sequelize.fn("SUM", Sequelize.col("amount")), "totalAmount"],
  ],
  raw: true,
});
const totalBalance = await Currentbalance.findAll({
  attributes: ["balance"],
  raw: true,
});
if (totalExpence.length === 0 || totalBalance.length === 0) {
  return res.json({
    message: "No expenses or balance found",
    success: false,
  });
}
const totalAmount = totalExpence[0].totalAmount || 0;
const balance = totalBalance[0].balance || 0;
return res.json({
  message: "Total expense and balance fetched successfully",
  success: true,
  totalAmount: totalAmount,
  balance: balance,
});
  
} catch (error) {
  console.log("error in getting total expence and balance", error);
  return res.json({
    message: "Error in getting total expence and balance",
    success: false,
  });
  
}
}

const getbalancehistory=async(req,res)=>
{
  try {
    
    const balanceHistory=await BalanceHistory.findAll({
      raw:true,
      balancehistories:[['createdAt', 'DESC']]
    })



if(balanceHistory.length === 0)
{
  return res.json({
    message: "No balance history found",
    success: false,
  });
}
    return res.json({
      message: "Balance history fetched successfully",
      success: true,
      balanceHistory: balanceHistory,
    });

  } catch (error) {
    
    console.log("error in getting balance history", error);
    return res.json({
      message: "Error in getting balance history",
      success: false,
    });
  }
}



const editexpences = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, category, vehicleId, remarks, date, quantity, dhs, fills, fuelStation,billInvoice } = req.body;

    // First, get the current expense to calculate balance difference
    const currentExpense = await Expences.findByPk(id);
    
    if (!currentExpense) {
      return res.json({
        message: "Expense not found",
        success: false,
      });
    }

    const oldAmount = parseFloat(currentExpense.amount);
    const newAmount = parseFloat(amount);
    const amountDifference = newAmount - oldAmount;

    // Update the expense
    const updateExpense = await Expences.update(
      {
        description,
        amount: newAmount,
        category,
        vehicle: vehicleId,
        remarks,
        date,
        quantity: category === "Fuel" ? quantity : null,
        dhs: category === "Fuel" ? dhs : null,
        fills: category === "Fuel" ? fills : null,
        fuelStation: category === "Fuel" ? fuelStation : null,
        billInvoice
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (!updateExpense || updateExpense[0] === 0) {
      return res.json({
        message: "Error in updating expense",
        success: false,
      });
    }

    // Update balance if amount changed
    if (amountDifference !== 0) {
      const currentBalance = await Currentbalance.findAll({
        raw: true
      });

      if (currentBalance.length === 0) {
        return res.json({
          message: "Balance record not found",
          success: false,
        });
      }

      const previousBalance = parseFloat(currentBalance[0].balance);
      const updatedBalance = previousBalance - amountDifference;

      const updateBalance = await Currentbalance.update(
        {
          balance: updatedBalance,
        },
        {
          where: {
            id: currentBalance[0].id,
          },
        }
      );

      if (!updateBalance) {
        return res.json({
          message: "Error in updating balance",
          success: false,
        });
      }
    }

    return res.json({
      message: "Expense updated successfully",
      success: true,
    });

  } catch (error) {
    console.log("error in updating expense", error);
    return res.json({
      message: error.errors?.[0]?.message || "Error in updating expense",
      success: false,
    });
  }
};

module.exports = { addexpences, viewexpences, addExpencebalance, gettotalexpenceandbalance,
  getbalancehistory, editexpences
 };

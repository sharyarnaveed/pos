const Currentbalance = require("../models/balance.model");
const BalanceHistory = require("../models/balancehistory.model");
const Expences = require("../models/expences.model");
const Vehicle = require("../models/Vehicle.model");
const { Sequelize } = require("sequelize");
const addexpences = async (req, res) => {
  try {
    const { description, amount, category, vehicleId, remarks } = req.body;

    const save = await Expences.create({
      description,
      amount,
      category,
      vehicle: vehicleId,
      remarks,
    });

    if (save) {
     
const oldbalance= await Currentbalance.findAll({
      raw:true
})


const previousbalance=oldbalance[0].balance
const updatedbalance=previousbalance-amount

const updatebalance = await Currentbalance.update(
  {

    balance: updatedbalance,
    
  },{
    where: {
      id: oldbalance[0].id,
    },

  })
    if(!updatebalance)
    {
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

    const expenceCount = await Expences.findAll({
      attributes: [
        "vehicle",
        [Sequelize.fn("COUNT", Sequelize.col("Expences.id")), "expenseCount"],
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
    console.log("error in viewing expenses", error);
    return res.json({
      message: "Error in viewing expenses",
      success: false,
    });
  }
};


const addExpencebalance =async (req,res)=>
{
  try {
    
const {amount,description}=req.body
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
      raw:true
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


module.exports = { addexpences, viewexpences, addExpencebalance, gettotalexpenceandbalance,
  getbalancehistory
 };

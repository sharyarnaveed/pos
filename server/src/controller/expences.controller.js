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
const previousbalance=getamount[0].balance
const updatedbalnce=previousbalance+amount

console.log(updatedbalnce);

if(getamount.length<0)
{
  return res.json({
    message: "No balance found",
    success: false,
  });
}

const updatebalance= await Currentbalance.update({
  balance:updatedbalnce
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

module.exports = { addexpences, viewexpences, addExpencebalance };

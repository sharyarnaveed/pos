const { Expences } = require("../models/expences.model");

const addexpences = async (req, res) => {
  try {
    const save = await Expences.create({
      description,
      amount,
      category,
      vehicle,
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
         include:[
            {
              model:Vehicle,
              as: 'vehicleDetails'
            }],

      order: [['createdAt', 'DESC']]
    });

    return res.json({
      success: true,
      expenceData: expenceData
    });
  } catch (error) {
    console.log("error in viewing expenses", error);
    return res.json({
      message: "Error in viewing expenses",
      success: false,
    });
  }
};

module.exports = { addexpences, viewexpences };
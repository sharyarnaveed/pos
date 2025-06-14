const Customer = require("../models/Customer.model");

const AddCustomers = async (req, res) => {
  try {
    const {
      customername,
      address,
      companyname,
      phoneno,
      mainowner,
      operator,
      taxnumber,
    } = req.body;

    console.log(
      customername,
      address,
      companyname,
      phoneno,
      mainowner,
      operator,
      taxnumber
    );
    if (
      !customername ||
      !address ||
      !companyname ||
      !phoneno ||
      !mainowner ||
      !operator ||
      !taxnumber
    ) {
      return res.json({
        message: "All values required",
        success: false,
      });
    } else {
      const save = await Customer.create({
        customername,
        address,
        companyname,
        phoneno:phoneno,
        mainowner,
        operator,
        taxnumber:taxnumber,
      });

    //   console.log(save);

      if (save) {
        return res.json({
          message: "Customer Added",
          success: true,
        });
      } else {
        console.log("data saved");
        return res.json({
          message: "Customer Addition Failed",
          success: false,
        });
      }
    }
  } catch (error) {
    console.log("error in adding customer", error.errors[0].message);
    return res.json({
      message: error.errors[0].message||"error in adding customer",
      success: false,
    });
  }
};



const viewCustomers= async(req,res)=>
{
    try {
        
const customerData=await Customer.findAll({
    raw:true
})
res.json({
    success:true,
    customerData:customerData
})
    } catch (error) {
        console.log("error in getting customers",error)
    }
}


module.exports = { AddCustomers,viewCustomers };

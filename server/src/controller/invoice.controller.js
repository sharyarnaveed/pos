const { Invoice, Order, Customer, Driver, Vehicle } = require("../models/associations");


const saveinvoice=async(req,res)=>
{
try {
    const {id,customer,date,company,total,status,orders}=req.body
    console.log(id,customer,date,company,total,status,orders);
    
    console.log(orders.length);
    
    const duplicateOrders = [];
    const createdInvoices = [];
    
    for(const order of orders)
        {
            console.log("order id",order);
            
            // Check if order already exists in an invoice
            const existingInvoice = await Invoice.findOne({
                where: {
                    orderid: order
                }
            });
            
            if (existingInvoice) {
                console.log(`Order ${order} already exists in invoice ${existingInvoice.invoicenumber}`);
                duplicateOrders.push({
                    orderId: order,
                    existingInvoiceNumber: existingInvoice.invoicenumber
                });
                continue; // Skip this order and move to the next one
            }
            
            // console.log(customer,date,company,total,status,orders);
            const save=await Invoice.create({
                invoicenumber:id,
                customer,
                date,
                company,
                total,
                status,
                orderid:order
            })
            createdInvoices.push(save);
    }
    
    // Check if any duplicates were found
    if (duplicateOrders.length > 0) {
        return res.status(400).json({
            message: "Some orders already exist in invoices",
            success: false,
            duplicateOrders: duplicateOrders,
            createdCount: createdInvoices.length,
            duplicateCount: duplicateOrders.length
        });
    }
    
    return res.json({
        message:"Invoice Created and Saved",
        success:true,
        createdCount: createdInvoices.length
    })
} catch (error) {
    console.log(error,"error in saving invoice");
    return res.status(500).json({
        message: "Error saving invoice",
        success: false,
        error: error.message
    });
}

}

const getInvoices = async (req, res) => {
  try {
    // Fetch all invoices with their related order
    const invoices = await Invoice.findAll({
      include: [
        {
          model: Order,
          as: "order",
          
          include: [
            { model: Customer, as: "CustomerDetails" },
            { model: Driver, as: "driverDetails" },
            { model: Vehicle, as: "vehicleDetails" }
          ]
        }
      ]
    });

    // Group by invoicenumber
    const grouped = {};
    invoices.forEach(inv => {
      const key = inv.invoicenumber;
      if (!grouped[key]) {
        grouped[key] = {
          id: key,
          date: inv.date,
          customer: inv.customer,
          company: inv.company,
          total: Number(inv.total),
          status: inv.status,
          orders: [],
        };
      }
      if (inv.order) {
        grouped[key].orders.push(inv.order);
      }
    });

    // Add orderCount and convert to array
    const result = Object.values(grouped).map(inv => ({
      ...inv,
      orderCount: inv.orders.length,
    }));
    return res.json({ invoices: result,success:true });
  } catch (error) {
    console.log(error, "error in fetching invoices");
    return res.status(500).json({ message: "Error fetching invoices",success:false  });
  }
};

module.exports = { saveinvoice, getInvoices };
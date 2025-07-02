const { Sequelize } = require("sequelize");
const Order = require("../models/order.model");
const Expences = require("../models/expences.model");
const Customer = require("../models/Customer.model");
const Driver = require("../models/Driver.model");
const Vehicle = require("../models/Vehicle.model");

const getDashboardData = async (req, res) => {
  try {
    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    const currentYear = currentDate.getFullYear();

    // Calculate total revenue from orders for current month
    const monthlyOrderRevenue = await Order.findAll({
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("total")), "totalRevenue"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "totalOrders"]
      ],
      where: Sequelize.where(
        Sequelize.fn("MONTH", Sequelize.col("createdAt")),
        currentMonth
      ),
      raw: true,
    });

    // Calculate total expenses for current month
    const monthlyExpenses = await Expences.findAll({
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalExpenses"]
      ],
      where: Sequelize.where(
        Sequelize.fn("MONTH", Sequelize.col("createdAt")),
        currentMonth
      ),
      raw: true,
    });

    // Get total number of orders (all time)
    const totalOrdersCount = await Order.count();

    // Get latest 6 orders with related data
    const latestOrders = await Order.findAll({
      include: [
        {
          model: Customer,
          as: "CustomerDetails",
          attributes: ["customername", "phoneno"]
        },
        {
          model: Driver,
          as: "driverDetails",
          attributes: ["drivername"]
        },
        {
          model: Vehicle,
          as: "vehicleDetails",
          attributes: ["plateNumber", "type"]
        }
      ],
      order: [["createdAt", "DESC"]],
      limit: 6,
      raw: true
    });

    // Get latest 6 expenses with related data
    const latestExpenses = await Expences.findAll({
      include: [
        {
          model: Vehicle,
          as: "vehicleDetails",
          attributes: ["plateNumber", "type"]
        }
      ],
      order: [["createdAt", "DESC"]],
      limit: 6,
      raw: true
    });

    // Calculate monthly revenue trend (last 6 months)
    const monthlyRevenueTrend = await Order.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "year"],
        [Sequelize.fn("SUM", Sequelize.col("total")), "revenue"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "orderCount"]
      ],
      where: {
        createdAt: {
          [Sequelize.Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1)
        }
      },
      group: [
        Sequelize.fn("MONTH", Sequelize.col("createdAt")),
        Sequelize.fn("YEAR", Sequelize.col("createdAt"))
      ],
      order: [
        [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "DESC"],
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "DESC"]
      ],
      raw: true
    });

    // Calculate monthly expense trend (last 6 months)
    const monthlyExpenseTrend = await Expences.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "year"],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "expenses"]
      ],
      where: {
        createdAt: {
          [Sequelize.Op.gte]: new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1)
        }
      },
      group: [
        Sequelize.fn("MONTH", Sequelize.col("createdAt")),
        Sequelize.fn("YEAR", Sequelize.col("createdAt"))
      ],
      order: [
        [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "DESC"],
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "DESC"]
      ],
      raw: true
    });

    // Prepare response data
    const dashboardData = {
      currentMonth: {
        revenue: parseFloat(monthlyOrderRevenue[0]?.totalRevenue || 0),
        expenses: parseFloat(monthlyExpenses[0]?.totalExpenses || 0),
        orders: parseInt(monthlyOrderRevenue[0]?.totalOrders || 0),
        profit: parseFloat(monthlyOrderRevenue[0]?.totalRevenue || 0) - parseFloat(monthlyExpenses[0]?.totalExpenses || 0)
      },
      totalOrders: totalOrdersCount,
      latestOrders: latestOrders,
      latestExpenses: latestExpenses,
      monthlyTrends: {
        revenue: monthlyRevenueTrend,
        expenses: monthlyExpenseTrend
      }
    };

    return res.json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: dashboardData
    });

  } catch (error) {
    console.log("Error in getting dashboard data", error);
    return res.json({
      success: false,
      message: "Error in fetching dashboard data",
      error: error.message
    });
  }
};


module.exports = {
  getDashboardData
};
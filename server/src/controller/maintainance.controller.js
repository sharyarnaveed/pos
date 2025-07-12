const Mechanic = require("../models/Mechanic.model");

const addMechanic = async (req, res) => {
  try {
    const { shopName, status } = req.body;

    console.log("Adding mechanic:", { shopName, status });

    if (!shopName) {
      return res.json({
        message: "Shop name is required",
        success: false,
      });
    }

    const save = await Mechanic.create({
      shopName,
      status: status || "Active",
    });

    if (save) {
      return res.json({
        message: "Mechanic added successfully",
        success: true,
      });
    } else {
      return res.json({
        message: "Failed to add mechanic",
        success: false,
      });
    }
  } catch (error) {
    console.log("Error adding mechanic:", error);
    return res.json({
      message: error.errors?.[0]?.message || "Error adding mechanic",
      success: false,
    });
  }
};

const viewMechanics = async (req, res) => {
  try {
    const mechanicsData = await Mechanic.findAll({
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    return res.json({
      success: true,
      mechanicsData: mechanicsData,
    });
  } catch (error) {
    console.log("Error fetching mechanics:", error);
    return res.json({
      message: "Error fetching mechanics",
      success: false,
    });
  }
};

const updateMechanic = async (req, res) => {
  try {
    const { id } = req.params;
    const { shopName, status } = req.body;

    const updated = await Mechanic.update(
      {
        shopName,
        status,
      },
      {
        where: { id },
      }
    );

    if (updated[0] > 0) {
      return res.json({
        message: "Mechanic updated successfully",
        success: true,
      });
    } else {
      return res.json({
        message: "Mechanic not found or no changes made",
        success: false,
      });
    }
  } catch (error) {
    console.log("Error updating mechanic:", error);
    return res.json({
      message: error.errors?.[0]?.message || "Error updating mechanic",
      success: false,
    });
  }
};

const deleteMechanic = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Mechanic.destroy({
      where: { id },
    });

    if (deleted > 0) {
      return res.json({
        message: "Mechanic deleted successfully",
        success: true,
      });
    } else {
      return res.json({
        message: "Mechanic not found",
        success: false,
      });
    }
  } catch (error) {
    console.log("Error deleting mechanic:", error);
    return res.json({
      message: "Error deleting mechanic",
      success: false,
    });
  }
};

module.exports = {
  addMechanic,
  viewMechanics,
  updateMechanic,
  deleteMechanic,
};
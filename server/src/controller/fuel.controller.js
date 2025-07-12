const FuelStation = require("../models/fuel.model");

const addFuelStation = async (req, res) => {
  try {
    const { stationName, location, fuelTypes, status } = req.body;

    if (!stationName || !location || !fuelTypes) {
      return res.json({
        message: "Station name, location, and fuel types are required",
        success: false,
      });
    }

    const existingStation = await FuelStation.findOne({
      where: { stationName },
    });

    if (existingStation) {
      return res.json({
        message: "Fuel station with this name already exists",
        success: false,
      });
    }

    const fuelStation = await FuelStation.create({
      stationName,
      location,
      fuelTypes,
      status: status || "Active",
    });

    if (fuelStation) {
      return res.json({
        message: "Fuel station added successfully",
        success: true,
        fuelStation,
      });
    } else {
      return res.json({
        message: "Error adding fuel station",
        success: false,
      });
    }
  } catch (error) {
    console.log("Error adding fuel station:", error);
    return res.json({
      message: error.errors?.[0]?.message || "Error adding fuel station",
      success: false,
    });
  }
};

const viewFuelStations = async (req, res) => {
  try {
    const fuelStationsData = await FuelStation.findAll({
      raw: true,
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      success: true,
      fuelStationsData,
    });
  } catch (error) {
    console.log("Error fetching fuel stations:", error);
    return res.json({
      message: "Error fetching fuel stations",
      success: false,
    });
  }
};

const updateFuelStation = async (req, res) => {
  try {
    const { id } = req.params;
    const { stationName, location, fuelTypes, status } = req.body;

    if (!stationName || !location || !fuelTypes) {
      return res.json({
        message: "Station name, location, and fuel types are required",
        success: false,
      });
    }

    const existingStation = await FuelStation.findByPk(id);
    if (!existingStation) {
      return res.json({
        message: "Fuel station not found",
        success: false,
      });
    }

    // Check if station name already exists for another station
    const duplicateStation = await FuelStation.findOne({
      where: {
        stationName,
        id: { [require("sequelize").Op.ne]: id },
      },
    });

    if (duplicateStation) {
      return res.json({
        message: "Fuel station with this name already exists",
        success: false,
      });
    }

    const [updatedRows] = await FuelStation.update(
      {
        stationName,
        location,
        fuelTypes,
        status: status || "Active",
      },
      {
        where: { id },
      }
    );

    if (updatedRows > 0) {
      return res.json({
        message: "Fuel station updated successfully",
        success: true,
      });
    } else {
      return res.json({
        message: "Fuel station update failed",
        success: false,
      });
    }
  } catch (error) {
    console.log("Error updating fuel station:", error);
    return res.json({
      message: error.errors?.[0]?.message || "Error updating fuel station",
      success: false,
    });
  }
};

const deleteFuelStation = async (req, res) => {
  try {
    const { id } = req.params;

    const existingStation = await FuelStation.findByPk(id);
    if (!existingStation) {
      return res.json({
        message: "Fuel station not found",
        success: false,
      });
    }

    const deletedRows = await FuelStation.destroy({
      where: { id },
    });

    if (deletedRows > 0) {
      return res.json({
        message: "Fuel station deleted successfully",
        success: true,
      });
    } else {
      return res.json({
        message: "Fuel station deletion failed",
        success: false,
      });
    }
  } catch (error) {
    console.log("Error deleting fuel station:", error);
    return res.json({
      message: "Error deleting fuel station",
      success: false,
    });
  }
};

module.exports = {
  addFuelStation,
  viewFuelStations,
  updateFuelStation,
  deleteFuelStation,
};
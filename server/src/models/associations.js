const Customer = require("./Customer.model.js");
const Driver = require("./Driver.model.js");
const Expences  = require("./expences.model.js");
const Order = require("./order.model.js");
const Vehicle = require("./Vehicle.model.js");

// Associations
Order.belongsTo(Vehicle, { foreignKey: 'vehicle', as: 'vehicleDetails' });
Vehicle.hasMany(Order, { foreignKey: 'vehicle' });

Order.belongsTo(Driver, { foreignKey: 'driver', as: 'driverDetails' });
Driver.hasMany(Order,{ foreignKey: 'driver' })

Order.belongsTo(Customer, { foreignKey: 'customer', as: 'CustomerDetails' });
Customer.hasMany(Order,{ foreignKey: 'customer' })


Expences.belongsTo(Vehicle, { foreignKey: 'vehicle', as: 'vehicleDetails' });
Vehicle.hasMany(Expences, { foreignKey: 'vehicle' });

module.exports = { Order, Vehicle, Expences };
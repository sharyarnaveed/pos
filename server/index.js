const { app } = require("./src/app.js");
const dotenv = require("dotenv");
const { sequelize } = require("./src/database/database.js");
require("./src/models/associations.js");

const port = 3000;

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");

    await sequelize.sync(); // Use sync({ alter: true }) if needed
    console.log("✅ Database synced");
  } catch (error) {
    console.error("❌ Error connecting or syncing the database:", error);
    throw error; // So that the server doesn’t start if DB fails
  }
}

testConnection()
  .then(() => {
    app.listen(port, () => {
      console.log("🚀 Server is running on port", port);
    });
  })
  .catch((error) => {
    console.error("❌ Server not started due to DB error:", error.message);
  });

require("dotenv").config();

const { createApp } = require("./app");
const { appDataSource } = require("./models/datasource");

const startServer = async () => {
  const app = createApp();
  const PORT = process.env.TYPEORM_SERVER_PORT;

	await appDataSource.initialize();

  app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  });
};

startServer();
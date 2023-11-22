const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(routes);

  app.get("/", (req, res) => {
    res.status(200).json({
      message: "hello",
    });
  });
  return app;
};

module.exports = createApp;

const express = require("express");
const cors = require("cors");
// const morgan = require("morgan");

const { router } = require("./src/routes");

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  // app.use(morgan("combined"));

  app.use(router);

  app.get("/", (req, res) => {
    res.status(200).json({
      message: "hello",
    });
  });

  return app;
};

module.exports = { createApp };

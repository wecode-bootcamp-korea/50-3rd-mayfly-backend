const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(routes);
  app.use(express.urlencoded({    
    limit:"500mb",
    extended: false
  }));
  app.use(express.json({
    limit : "500mb"
  }))

  return app;
};
  app.get("/", (req, res) => {
    res.status(200).json({
      message: "hello",
    });
  });
  return app;
};

module.exports = createApp;

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const morgan = require('morgan');

const createApp = () => {
<<<<<<< HEAD
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(routes);

    app.get('/', (req, res) => {
        res.status(200).json({
            message: "hello"
        });
    });
    return app;
};

module.exports = { createApp };
=======
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(routes);
  app.use(morgan('combined'));
  return app;
};


module.exports = createApp ;
>>>>>>> main

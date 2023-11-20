require("dotenv").config();
const http = require('http');
const createApp = require("./app");
const {appDataSource} = require("./models/datasource");

const start = async () => {
    try {
        const app = createApp();
        app.get('/hi', (req, res) => {
          res.status(200).json({ message: "hello" });
      });

      appDataSource.initialize()
        .then(() => {
            console.log("Data Source has been initialized!")
        })
        .catch((err) => {
            console.error("Error occured during Data Source initialization", err)
        })
        
        const server = http.createServer(app);
        server.listen(process.env.TYPEORM_SERVER_PORT, () => 
            console.log(`Server is listening on ${process.env.TYPEORM_SERVER_PORT}`)
        );
    } catch (err) { 
        console.error(err);
    };
};

start();
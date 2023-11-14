const {DataSource} = require('typeorm');

const dotenv = require("dotenv")

dotenv.config()

const appDataSource = new DataSource({
    type : process.env.test.TYPEORM_CONNECTION,
    host: process.env.test.TYPEORM_HOST,
    port: process.env.test.TYPEORM_PORT,
    username: process.env.test.TYPEORM_USERNAME,
    password: process.env.test.TYPEORM_PASSWORD,
    database: process.env.test.TYPEORM_DATABASE
})

appDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error occured during Data Source initialization", err)
    })

module.exports = { appDataSource }

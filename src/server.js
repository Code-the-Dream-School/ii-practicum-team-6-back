require('dotenv').config();
const app = require("./app");
const connectDB = require('../db/connect')

const dbURI = process.env.MONGO_URI
const PORT = process.env.PORT || 3000

const start = async () => {
    try {
        await connectDB(dbURI);
        app.listen(PORT, "0.0.0.0", () => console.log(`Server is listening port ${PORT}...`));
    } catch (error) {
        console.log(error);
    }
};

start();

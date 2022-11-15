const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require("./app.js");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('starting on port 3456');
    app.listen(3456);

})

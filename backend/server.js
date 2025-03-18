const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path');
require('dotenv').config();


const app = express();



//mongodb connection string
const connectionString = process.env.CONNECTION_STRING;

mongoose.connect(connectionString)
    .then(() => console.log("database connected"))
    .catch((err) => {
        console.log(err)
        process.exit(1);
    })

const port = 7001;
app.listen(port, () => console.log("server running in port 7001"));
const HTTP_PORT = process.env.PORT || 8080;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

mongoose.connect(process.env.mongooseToken);

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req,res) =>
{
    res.json({message:"API Listening"});
});
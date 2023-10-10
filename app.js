"use strict";

const questionsRouter = require("./questions.js");
const express = require("express");
const app = express();

app.use(questionsRouter);

const PORT = 8888;

const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const dbhost = process.env.DB_HOST;
const dbport = process.env.DB_PORT;
const dbname = process.env.DB_NAME;
const dbuser = process.env.DB_USER;
const dbpwd = process.env.DB_PWD;
const connectionString = `mongodb://${dbuser}:${dbpwd}@${dbhost}:${dbport}/${dbname}`;
// console.log(connectionString);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Db connection established"))
  .catch((err) => console.log("Error connecting to db"));

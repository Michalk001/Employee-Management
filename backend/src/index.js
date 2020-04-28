import "@babel/polyfill";


import config from './config.json'
import cors from 'cors'

import database from "./database/models/database"

import { router } from "./routes/router"
import { authorization } from "./utils/authorization"

database.sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))

database.sequelize.sync().then(function () {

  console.log('Database looks fine')


}).catch(function (err) {

  console.log(err, "Something  wrong ")

});


const express = require('express');
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cors());


authorization();

router(app);
const PORT = process.env.PORT || config.PORT;
app.listen(PORT, () => { console.log(`App listening on port ${PORT}`); }); 
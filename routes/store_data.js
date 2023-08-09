const route = require('express').Router();
const controller = require("../controller/controller");

route.post('/data',controller.storeData);

module.exports = route;
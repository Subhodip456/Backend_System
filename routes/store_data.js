const route = require('express').Router();
const controller = require("../controller/controller");
const authenticateUser = require("../middleware/authUser");


route.post('/data',authenticateUser,controller.storeData);

module.exports = route;
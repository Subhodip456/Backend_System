const route = require('express').Router();
const controller = require("../controller/controller");
const authenticateUser = require("../middleware/authUser");


route.get('/data/:key',authenticateUser,controller.retrieveData);
module.exports = route;
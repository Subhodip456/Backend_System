const route = require('express').Router();
const controller = require("../controller/controller");
const authenticateUser = require("../middleware/authUser");


route.put('/data/:key',authenticateUser,controller.updateData);
module.exports = route;
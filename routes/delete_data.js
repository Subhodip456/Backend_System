const route = require('express').Router();
const controller = require("../controller/controller");
const authenticateUser = require("../middleware/authUser");


route.delete('/data/:key',authenticateUser,controller.deleteData);
module.exports = route;
const route = require('express').Router();
const controller = require("../controller/controller");

route.post('/register',controller.createUser);

module.exports = route;


const route = require('express').Router()
const controller = require("../controller/controller")

route.post('/token',controller.generateTokens)

module.exports = route
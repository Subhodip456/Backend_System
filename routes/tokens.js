const route = require('express').Router()
const controller = require("../controller/controller")

route.post('/tokens',controller.generateTokens)

module.exports = route
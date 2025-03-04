const Joi = require("joi")

const object = Joi.object().keys({
  name: Joi.string().required().label("Nome")
})

module.exports = { object }
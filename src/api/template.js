const fs = require("fs")
const path = require("path")

const get = async (req, res) => {
  const object = req.query
  const route = req.params.route
  const facadePath = path.join(__dirname, `../facade/${route}.js`)

  if (!fs.existsSync(facadePath)) {
    return res.sendStatus(400)
  }

  const facade = require(facadePath)

  const result = await facade.get(object)
  
  if (result) {
    return res.status(200).send(result)
  }
  return res.sendStatus(404)
}

const insert = async (req, res) => {
  const object = req.body
  const route = req.params.route
  const userId = req.cookies.cookieID

  const facade = require(`../facade/${route}`)

  const result = await facade.insert(object, userId)
  if (result.errors) {
    return res.status(400).send(result.errors)
  }
  return res.sendStatus(204)
}

const update = async (req, res) => {
  const id = req.params.id
  const object = req.body
  const route = req.params.route
  const userId = req.cookies.cookieID

  const facade = require(`../facade/${route}`)

  const result = await facade.update(object, id, userId)
  if (result.errors) {
    return res.status(400).send(result.errors)
  }
  return res.sendStatus(204)
}

const remove = async (req, res) => {
  const id = req.params.id
  const route = req.params.route
  const facade = require(`../facade/${route}`)

  const result = await facade.remove(id)
  if (result) {
    return res.sendStatus(204)
  }
  return res.sendStatus(400)
}

module.exports = {
  get,
  insert,
  update,
  remove,
}

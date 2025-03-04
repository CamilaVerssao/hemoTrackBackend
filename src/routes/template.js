const route = "/template"
const api = require("../api/template")
const auth = require("../api/auth")

module.exports = (router) => {
  // router.route(route).all(auth.validate).get(api.get).post(api.insert)
  router.route(route).get(api.get).post(api.insert)
  // router.route(`${route}/:id`).all(auth.validate).patch(api.update).delete(api.remove)
  router.route(`${route}/:id`).patch(api.update).delete(api.remove)
}

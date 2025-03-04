const facade = require('../facade/validateAcl')
const moment = require('moment')

const validate = async (req, res, next) => {
  if (req.cookies.cookieID) {
    const url = req.originalUrl.split('/')[1].split('?')[0]

    const expiration = moment().add(1, "hours").toDate();
    res.cookie("cookieID", req.cookies.cookieID, { expires: expiration, httpOnly: true });

    result = await facade.validateAcl(req.cookies.cookieID, `/${url}`)

    if (result === true) {
      return next()
    } else {
      return res.sendStatus(401)
    }
  } else {
    return res.sendStatus(401)
  }
}

module.exports = { validate }

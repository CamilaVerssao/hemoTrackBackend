const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

const helmet = require('helmet')
require('dotenv').config()
const routes = require('./config/routes')

const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(bodyParser.json())
app.use(cors({ credentials: true, origin: process.env.CORS }))
app.use(helmet())

routes.start(app)

module.exports = app

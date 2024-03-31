const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
require('express-async-errors')
const blogsRouter = require('./controllers/blog')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const morgan = require('morgan')

const app = express()

mongoose.set('strictQuery', false)

logger.info('connecting to mongodb on', config.MONGODB_URL)
mongoose.connect(config.MONGODB_URL)
	.then(() => {
		logger.info('connected to mongodb')
	})
	.catch((error) => {
		logger.error('error connecting to mongodb: ', error.message)
	})

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
if(process.env.NODE_ENV !== 'test'){
	app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))
}
app.use('/api/blogs', blogsRouter)

app.use(middleware.unknownPath)
app.use(middleware.errorHandler)

module.exports = app
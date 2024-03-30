const logger = require('./logger')
const morgan = require('morgan')

const unknownPath = (request, response) => {
    response.status(404).json({
        error: 'uknown path'
    })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if(error.name === 'CastError'){
        return response.status(400).json({
            error: error.message
        })
    }
    if(error.name === 'ValidationError'){
        return response.status(400).json({
            error: error.message
        })
    }

    next(error)
}

morgan.token('request-body', function getId (req) {
	return JSON.stringify(req.body)
})

module.exports = {
    unknownPath,
    errorHandler
}
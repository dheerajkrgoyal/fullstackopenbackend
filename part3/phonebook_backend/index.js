const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
require('dotenv').config()

const app = express()

const Person = require("./models/person")

morgan.token('request-body', function getId (req) {
    return JSON.stringify(req.body)
})

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))


app.get('/', (request, response) => {
    response.send("Phonebook Server")
})

app.get('/info', (request, response, next) => {
    Person.countDocuments({})
        .then(personCount => {
            const date = new Date()
            response.send(`<p>Phonebook has info for ${personCount} people</p>
                          <p>${date}</p>`)
        })
        .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        }) 
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if(!person){
                return response.status(404).json({
                    error: 'person not found'
                })
            }else{
                response.json(person)
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(deleted => {
            if(!deleted){
                return response.status(404).json({
                    error: 'person not found'
                })
            }else{
                response.json(deleted)
            }
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if(!body.name){
        return response.status(400).json({
            error: 'bad request: name not found'
        })
    }

    if(!body.number){
        return response.status(400).json({
            error: 'bad request: number not found'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
    .then(savedPerson => {
        response.status(201).json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    if(!body.name){
        return response.status(400).json({
            error: 'bad request: name not found'
        })
    }

    if(!body.number){
        return response.status(400).json({
            error: 'bad request: number not found'
        })
    }

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new : true})
        .then(updated => {
            if(!updated){
                return response.status(404).json({
                    error: 'person not found'
                })
            }else{
                response.json(updated)
            }
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if(error.name === 'CastError'){
        return response.status(400).json({
            error: error.message
        })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, ()=> {
    console.log(`Phonebook server started on port ${PORT}`)
})
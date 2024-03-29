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



let persons = []

app.get('/', (request, response) => {
    response.send("Phonebook Server")
})

app.get('/info', (request, response) => {
    Person.countDocuments({})
        .then(personCount => {
            const date = new Date()
            response.send(`<p>Phonebook has info for ${personCount} people</p>
                          <p>${date}</p>`)
        })
})

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        }) 
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            if(!person){
                return response.status(404).json({
                    error: 'person not found in the server'
                })
            }
            response.json(person)
        })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(deleted => {
            return response.json(deleted)
        })
        .catch(error => {
            return response.status(400).json({
                error: error.message
            })
        })
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name){
        return response.status(400).json({
            error: 'Bad request because the request does not contain name'
        })
    }

    if(!body.number){
        return response.status(400).json({
            error: 'Bad request because the request does not contain number'
        })
    }

    Person.findOne({name: body.name})
        .then(person => {
            if(person){
                return response.status(400).json({
                    error: 'Bad request because the name already exist'
                })
            }
            else{
                const person = new Person({
                    name: body.name,
                    number: body.number
                })
            
                person.save().then(savedPerson => {
                    response.json(savedPerson)
                })
            }
        })
})

const PORT = process.env.PORT

app.listen(PORT, ()=> {
    console.log(`Phonebook server started on port ${PORT}`)
})
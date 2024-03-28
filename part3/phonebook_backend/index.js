const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()

morgan.token('request-body', function getId (req) {
    return JSON.stringify(req.body)
})

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))



let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send("Phonebook Server")
})

app.get('/info', (request, response) => {
    const countPersons = persons.length
    const date = new Date()
    response.send(`<p>Phonebook has info for ${countPersons} people</p>
                  <p>${date}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if(!person){
        return response.status(404).json({
            error: `person with ${id} not found in the server`
        })
    }
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const deleted = persons.find(person => person.id == id)
    if(!deleted){
        return response.status(404).json({
            error: `person is not present in the server`
        })
    }
    
    persons = persons.filter(person => person.id !== id)
    response.json(deleted)
})

const getRandom = (min, max) => {
    return Math.floor(
        Math.random() * (max - min) + min
      )
}

const generateId = () => {
    const uniqueId = getRandom(1, 1000)
    const isDuplicate = persons.find(person => person.id === uniqueId)
    if(!isDuplicate){
        return uniqueId
    }
    return generateId()
}

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

    const duplicateName = persons.find(person => person.name === body.name)

    if(duplicateName){
        return response.status(400).json({
            error: 'Bad request because the name already exist'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, ()=> {
    console.log(`Phonebook server started on port ${PORT}`)
})
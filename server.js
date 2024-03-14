const express = require('express')
const app = express()

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

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(express.json())
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const entries = persons.length.toString()
    const currentTime = new Date().toString()
    response.send(`<p>Phonebook has info for ${entries} people</p><p>${currentTime}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const entry = persons.find(entry => entry.id === id)
    
    if (entry) {
        response.json(entry)
    } else {
        response.status(404).end()
    }
})

const createNewId = () => {
    return Math.floor(Math.random() * 1000) 
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'All entries should be filled.'})
    } else if (persons.some(entry => entry.name === body.name)) {
        return response.status(400).json({ error: 'Please enter a unique name.'})
    }

    const entry = 
        {
            "id": createNewId(),
            "name": body.name,
            "number": body.number
        }
    
    persons = persons.concat(entry)

    response.json(entry)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(entry => entry.id !== id)

    response.status(204).end()
})
  
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, (request, response) => {
    console.log(`Listening on port ${PORT}`)
})
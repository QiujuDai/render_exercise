require('dotenv').config()
const PORT = process.env.PORT

const express = require('express')
// const cors = require('cors')
// app.use(cors())

const Note = require('./models/note')
const app = express()
app.use(express.static('dist'))
app.use(express.json())


// let notes = [
//   {
//     id: "1",
//     content: "HTML is easy",
//     important: true
//   },
//   {
//     id: "2",
//     content: "Browser can execute only JavaScript",
//     important: false
//   },
//   {
//     id: "3",
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true
//   }
// ]

// const password = process.argv[2]
// const url = `mongodb+srv://fullstack:${password}@cluster0.elsq0lv.mongodb.net/noteApp?appName=Cluster0`
// mongoose.set('strictQuery', false)
// mongoose.connect(url, {family: 4})
// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })

// noteSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })
// const Note = new mongoose.model('Note', noteSchema)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
  
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  Note.findById(id).then(note => {
    if(note){
      response.json(note)
    } else{
      response.status(404).end()
    }  
  })
  .catch(error => {
    console.log(error)
    next(error)
    // response.status(500).send({error: 'malformatted id'})
  })
  // const note = notes.find(note => note.id === id)
  // response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id

  Note.findByIdAndDelete(id)
  .then(result => {
    if (result) {
        // Item existed and was deleted
        response.status(204).end()
      } else {
        // Item was not found in the database
        response.status(404).json({ error: 'note not found' })
      }
  })
  .catch(error => next(error))
})

// const generateId = () => {
//   const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0
//   return String(maxId + 1)
  
// }

app.post('/api/notes', (request, response, next) => {
  const body = request.body
  console.log(body)
  if(!body.content){
    response.status(400).json({error: 'content missing'})
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
    // id: generateId()
    })

    note.save().then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))

})

app.put('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const newNote = request.body
  Note.findById(id)
  .then(note => {
    if(!note){
      return response.status(404).end()
    }

    note.content = newNote.content
    note.important = newNote.important
    
    return note.save().then((updatedNote) => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({error: 'malformatted id'})
    }
  else if(error.name === 'ValidationError'){
      return response.status(400).json({error: error.message})
    }  
  next(error)
}
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

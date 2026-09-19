require('dotenv').config()
const PORT = process.env.PORT

const express = require('express')
const cors = require('cors')
const Note = require('./models/note')
// const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))


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
    response.json(note)
  })
  // const note = notes.find(note => note.id === id)
  // response.json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0
  return String(maxId + 1)
  
}

app.post('/api/notes', (request, response) => {
  const body = request.body
  if(!body.content){
    response.status(400).json({error: 'content missing'})
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    id: generateId()
    })

    note.save().then(savedNote => {
      response.json(savedNote)
    })
  
  // notes = notes.concat(note)
  // console.log(note)
  // response.json(note)
})

app.put('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const newNote = request.body
  const notesId = notes.findIndex(note => note.id === id)
  if(notesId !== -1){
    const updatedNote = {... notes[notesId], important: newNote.important}
    notes[notesId] = updatedNote
    response.json(updatedNote)
  }
  else{
    response.status(404).end()
  }

})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

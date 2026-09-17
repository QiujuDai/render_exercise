const PORT = process.env.PORT || 3001
// const http = require('http')
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())


let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'application/json' })
//   response.end(JSON.stringify(notes))
// })

// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  response.json(note)
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

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId()
  }
  
  notes = notes.concat(note)
  console.log(note)
  response.json(note)
})

app.put('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const newNote = request.body
  console.log('backend put!')
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

// const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

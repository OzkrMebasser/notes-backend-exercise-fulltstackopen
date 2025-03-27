const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

morgan.token("body", function getBody(req) {
  const body = JSON.stringify(req.body);
  return body;
});

const app = express();
app.use(express.static('dist'))

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: false,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: true,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: false,
  },
];

app.use(express.json());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body "));
app.use(cors());

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({ error: "Content is required" });
  }

  const newNote = {
    id: (notes.length ? Math.max(...notes.map((n) => Number(n.id))) + 1 : 1).toString(),
    content: body.content,
    important: Math.random() > 0.5,
  };

  notes.push(newNote);
  response.status(201).json(newNote);
});

app.put("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const noteIndex = notes.findIndex((note) => note.id === id);

  if (noteIndex === -1) {
    return response.status(404).json({ error: "Note not found" });
  }

  const note = notes[noteIndex];
  const updatedNote = { ...note, important: !note.important };
  notes[noteIndex] = updatedNote;

  response.json(updatedNote);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

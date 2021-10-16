const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.body;
  
  const userAlreadyExists = users.some((user) => user.username === username);
  if (userAlreadyExists) {
    return response.status(400).json({ error: "Username already exists" });
  }

  return next();
}

app.post('/users', checksExistsUserAccount, (request, response) => {
  const { name, username, todos } = request.body;

  const id = uuidv4();

  users.push({
    id,
    name,
    username,
    todos: [],
  });

  return response.status(201).send(users.find((user) => user.id === id));
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const userFound = users.find((user) => user.username === username);

  response.status(200).send(userFound.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
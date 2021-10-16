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
  const { username } = request.headers;
  const { title, deadline } = request.body;

  const id = uuidv4();

  const userFound = users.find((user) => user.username === username);

  userFound.todos.push({
    id,
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date
  });

  response.status(201).send(userFound.todos.find(( todo ) => todo.id === id))
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { username } = request.headers;
  const { title, deadline } = request.body;

  const userFound = users.find(( user ) => user.username === username);
  
  const taskAlreadyExists = userFound.todos.some(( task ) => task.id === id )
  if (!taskAlreadyExists) {
    return response.status(404).send({ error: 'Task not found' });
  }

  const taskFound = userFound.todos.find(( task ) => task.id === id);

  taskFound.title = title;
  taskFound.deadline = new Date(deadline);

  return response.status(200).send(taskFound);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { username } = request.headers;

  const userFound = users.find(( user ) => user.username === username);
  
  const taskAlreadyExists = userFound.todos.some(( task ) => task.id === id )
  if (!taskAlreadyExists) {
    return response.status(404).send({ error: 'Task not found' });
  };

  const taskFound = userFound.todos.find(( task ) => task.id === id);

  taskFound.done = !taskFound.done;

  return response.status(200).send(taskFound);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { username } = request.headers;

  const userFound = users.find(( user ) => user.username === username);
  
  const taskAlreadyExists = userFound.todos.some(( task ) => task.id === id )
  if (!taskAlreadyExists) {
    return response.status(404).send({ error: 'Task not found' });
  };

  userFound.todos = userFound.todos.filter(( task ) => task.id !== id);

  return response.status(204).send(userFound);
});

module.exports = app;
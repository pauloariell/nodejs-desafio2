const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequest(request, response, next){
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}${url}]`
  console.log(logLabel);

  return next();
}

function validateRepositoryId(request, response, next){
  const { id } = request.params;

  if (!isUuid(id)){
    return response.status(400).json({error: 'Invalid Repository ID.'});
  }
  return next();
}

app.use(logRequest);
app.use('/repositories/:id',validateRepositoryId)


app.get("/repositories", (request, response) => {
  // TODO
  const { title } = request.query;

  const results = title
    ? repositories.filter( repository => repository.title.includes(title))
    : repositories;


  response.json(results);
});

app.post("/repositories", (request, response) => {
  // TODO
  const { title, url, techs } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(repository);
  response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // TODO
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }
  
  const { title, url, techs } = request.body;
  const repository = repositories[repositoryIndex]

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  repositories[repositoryIndex] = repository;

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  repositories.splice(repositoryIndex);

  return response.status(200).json({message:"Successfully deleted"});
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }
  const repository = repositories[repositoryIndex]

  repository.likes++;

  return response.json(repository);
});

module.exports = app;

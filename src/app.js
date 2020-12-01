const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get('/repositories', (request, response) => {
  response.json(repositories);
});

app.post('/repositories', (request, response) => {

  const { title, url, techs } = request.body;

  const repository = {
    id: uuidv4(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  response.status(200).json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const indexRepository = repositories.findIndex(repository => { return repository.id === id });

  if (indexRepository < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }

  const { title, url, techs } = request.body;

  const repository = repositories[indexRepository];

  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  repositories[indexRepository] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {

  const { id } = request.params;

  const indexRepository = repositories.findIndex(repository => { return repository.id === id });

  if (indexRepository < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }

  repositories.splice(indexRepository, 1);

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const indexRepository = repositories.findIndex(repository => { return repository.id === id });

  if (indexRepository < 0) {
    return response.status(400).json({ error: 'repository not found' });
  }

  const repository = repositories[indexRepository];

  repository.likes++;

  repositories[indexRepository] = repository;

  return response.json(repository);
});

module.exports = app;

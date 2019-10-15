const express = require('express');
const server = express();

let numberOfResquests = 0;
const projects = [];

server.use(express.json());

//MIDDLEWARE
server.use((req, res, next) => {
    numberOfResquests++;

    console.log(`Número de requisições realizadas: ${numberOfResquests}`);

    return next();
});

function checkProjectExist(req, res, next) {
    const { id } = req.params;
    const project = projects.find(p => p.id == id);

    if(!project){
        return res.status(400).json({ error: 'Project does not exist!' });
    }

    req.id = id;

    return next();
}

//ROUTES

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.post('/projects', (req, res) => {
    const { id } = req.body;
    const { title } = req.body;

    const project = {
        id,
        title,
        tasks: []
    }

    projects.push(project);

    return res.json(projects);
});

server.post('/projects/:id/tasks', checkProjectExist, (req, res) => {
    const { tasks } = req.body;

    const project = projects.find(p => p.id == req.id);
    project.tasks.push(tasks);

    return res.json(project);
});

server.put('/projects/:id', checkProjectExist, (req, res) => {
    const { title } = req.body;

    const project = projects.find(p => p.id == req.id);
    project.title = title;
    
    return res.json(project);
});

server.delete('/projects/:id', checkProjectExist, (req, res) => {  
    const projectIndex = projects.findIndex(p => p.id == req.id);
  
    projects.splice(projectIndex, 1);
  
    return res.send();
  });

server.listen(3000, () => console.log('Server up & running!'));

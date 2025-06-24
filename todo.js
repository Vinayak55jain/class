const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

let todos = [];

app.get('/todos', (req, res) => {
    res.json(todos);
});
app.get('/todos/:id',(req,res)=>{
    const todoId= parseInt(req.params.id, 10);
    const newtodo= todos.find(t=>t.id==todoId);
    if(newtodo){
        res.status(200).json(newtodo);
    }
    else{
        res.status(404).json({ message: 'Todo not found' });
    }
})

app.post('/todos', (req, res) => {
    const newTodo = {
        id: Math.floor(Math.random() * 1000),
        title: req.body.title,
        description: req.body.description
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});
app.put('/todos/:id', (req, res) => {
    const newtodoId = parseInt(req.params.id, 10);
    const newtodo= todos.find(t=> t.id==newtodoId);
    if (newtodo){
        newtodo.title = req.body.title || newtodo.title;
        newtodo.description = req.body.description || newtodo.description;
        res.status(200).json(newtodo);
    }
    else{
        res.status(404).json({ message: 'Todo not found' });
    }
});


app.delete('/todos/:id',(req,res)=>{
    const todoId = parseInt(req.params.id, 10);
    const todoIndex = todos.findIndex(t => t.id === todoId);
    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
})

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});

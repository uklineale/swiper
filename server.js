var express = require('express'),
    workers = require('./routes/workers'),
    path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.configure(function(){
    app.use(express.bodyParser());
});


app.get('/workers', workers.findAll);
app.get('/workers/:id', workers.findById);
app.post('/workers', workers.addWorker);
app.put('/workers/:id', workers.updateWorker);
app.delete('/workers/:id', workers.deleteWorker); 

app.listen(3000);
console.log('Listening on port 3000...');

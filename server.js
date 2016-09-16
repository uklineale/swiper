var express = require('express'),
    workers = require('./routes/workers'),
    path = require('path');
var port = process.env.PORT || 3000;
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

app.listen(port);
console.log('Listening on port '+port+'...');

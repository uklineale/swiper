var mongo = require('mongodb'),
    fs = require('fs'),
    ObjectId = mongo.ObjectId;

var Server = mongo.Server,
    Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect:true});
db = new Db('workerdb', server);

/*
 *  Starts the mongo db, populates the 'workers' collection
 *  Logs any mongodb issues to errorLog.txt
 */
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'workerdb' database");
        db.collection('workers', {strict:true}, function(err1, collection) {
            if (err1) {
                try {
                    fs.appendFileSync("./errorLog.txt", err1);
                }
                catch (err2) {
                    console.error(err2);
                }
                console.log("The 'workers' collection doesn't exist. Rebuilding collection...");
                populateWorkers();
            }
        });
    }
    else {
        try {            
            fs.appendFileSync("./errorLog.txt", err);
        }
        catch (openingConnectionErr){
            console.error(openingConnectionErr); 
        }
        
    }
});

/*
 *  Find all workers, return them
 *  route: /workers
 */
exports.findAll = function(req, res) {
    db.collection('workers', function (err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

/*
 *  Find a worker by id
 *  route: /workers/id
 */
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Finding by Id: ' + id);
    db.collection('workers', function(err, collection){
        collection.findOne(ObjectId(id), function(err, item){
            res.send(item);
        });
    });
};

exports.addWorker = function(req, res) {
    var worker = req.body;
    console.log('Adding worker: ' + worker);
    db.collection('workers', function(err, collection){
        collection.insert(worker, {safe:true}, function(err, result){
            if (err){
                res.send({'error': 'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

//Doesn't do logging yet
exports.updateWorker = function(req, res) {
    var id = req.params.id;
    var worker = req.body;
    console.log('Updating worker: ' + id);
    console.log(JSON.stringify(worker));
    db.collection('workers', function(err, collection) {
        collection.update(ObjectId(id), worker, {safe:true}, 
        function(err, result) {
            if (err) {
                console.log('Error updating workers: ' + err);
                res.send({'error': 'An error has occurred'});
             } else {
                 console.log('' + result + ' documents(s) updated');
                 res.send(worker);
            }
        });
    });
}

exports.deleteWorker = function(req, res) {
    console.log(req.params);
    var id = req.params.id;
    console.log('Deleting worker: ' + id);
    db.collection('workers', function(err, collection){
        collection.remove(ObjectId(id),
        function(err, result){
            if (err) {
                try{
                    fs.appendFileSync('./errorLog.txt', err);
                }
                catch (err1) {
                    console.err(err1);
                }
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}


var populateWorkers = function() {

    var workers = [
    {
        name: "Johnny Jimblefingers",
        strength: 5,
        value: 10,
        weakness: "Simple violin jigs"
    },
    {
        name: "Michale Manhours",
        strength: 4,
        value: 12,
        weakness: "A smooth thigh"
    }];

    db.collection('workers', function(err, collection) {
        collection.insert(workers, {safe:true}, function(err, result){
            if (err) {
                 fs.appendFileSync("./errorLog.txt", "\n" + err, function(err) {
                    if (err) { return console.log(err); }
                });
            }
        });
    });
}

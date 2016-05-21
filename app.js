var mongo = require('mongodb');
var express = require('express');
var monk = require('monk');
var bodyParser = require('body-parser')

var app = new express();
var db =  monk('localhost:27017/test');
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.get('/',function(req,res){
  db.driver.admin.listDatabases(function(e,dbs){
      res.json(dbs);
  });
});

app.get('/collections',function(req,res){
  db.driver.collectionNames(function(e,names){
    res.json(names);
  })
});

app.get('/collections/:name',function(req,res){
  var collection = db.get(req.params.name);
  collection.find({}, { limit: 20 }, function(e, docs) {
    res.json(docs);
  })
});

app.post('/log', function(req, res) {
    var db = req.db;
    var collection = db.get('log');
	req.body.timestamp = new Date();
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    }); 
    res.json({ message: "Log written to db"});
});

app.listen(3001)
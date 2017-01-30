var mongodb = require('mongodb')
var express = require('express')
var app = express()
const ImagesClient = require('google-images');
var cseid = process.env.CSE_ID;
var url = process.env.MONGOLAB_URI;
var apikey = process.env.API_KEY;
let client = new ImagesClient(cseid, apikey);

app.use(express.static('public'));
var MongoClient = mongodb.MongoClient;

MongoClient.connect(url, function(err,db){
  if (err){
    console.log(err)
  } else {
    console.log('connection established to ' + url)
    var history = db.collection('history')

    app.get('/', function(req, res){
      res.sendFile(__dirname + '/index.html');
    })

    app.get('/api/imagesearch/:searchQuery', function(req, res){
      var searchQuery = req.params.searchQuery
      var offset = req.query.offset
      console.log(searchQuery)
      console.log(offset)
      client.search(searchQuery, {page: offset})
          .then(function (images) {
            res.json(images);
          });
      history.insert({term: searchQuery, when: new Date()}, function(err, result){
        if (err){
          console.log('inserting error ' + err)
        }
      })
    })
    app.get('/api/latest/imagesearch/', function(req, res){
      var cursor = history.find({}, {_id: 0}).sort({_id:-1}).limit(10);
      cursor.toArray(function(err, result){
        if (err){
          console.log('find error ' + err)
        } else if (result.length) {
          res.json(result);
        }
      })
    })



    var port = process.env.PORT || 3000;

    app.listen(port, function(){
      console.log('App listening at ' + port)
    })
  }

});

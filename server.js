var mongodb = require('mongodb')
var express = require('express')
var app = express()
const ImagesClient = require('google-images');
var cseid = '005930505710033046788:c2wonj71wqw';
var apikey = 'AIzaSyCE4354_Pid-jGvJaKgaWKItp9vAB9CFg8';
let client = new ImagesClient(cseid, apikey);

app.use(express.static('public'));
var MongoClient = mongodb.MongoClient;

app.get('/:searchQuery', function(req, res){
  var searchQuery = req.params.searchQuery
  console.log(searchQuery)
  client.search(searchQuery)
      .then(function (images) {
        res.json(images);
      });
})


var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log('App listening at ' + port)
})

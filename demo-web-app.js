'use strict';

// Import express module
const express = require('express');

// Import body parser module
const bodyParser = require('body-parser');

// Load mongoose package
const mongoose = require('mongoose');

// App
const app = express();
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

// Connect to MongoDB and create/use database called meetup
mongoose.connect('mongodb://mongo:27017/meetup');

// Create a Device schema
var DeviceSchema = new mongoose.Schema({
  name: { type : String, default : "NO-NAME" },
  mac_id: { type : String, unique : true , required : true },
  status: { type : String, default : "UNLOCKED" }
},
{
  timestamps : true
});

// Create models based on the schema
var DeviceModel = mongoose.model('Device', DeviceSchema);

// ------------------------------------------------------
var addDeviceToDb = function (req, res) {
  console.log('Adding device to DB');

  var deviceToAdd = new DeviceModel ({
    name : req.body.name,
    mac_id : req.body.mac_id,
    status : req.body.status
  });

  // Save it to database
  deviceToAdd.save (function (err) {
    if (err) {
      console.log(err);
      res.statusCode = 500;
      console.log('');
      return res.send('Error 500: Unable to store device to DB.');
    }
  });

  console.log('');
  res.send(deviceToAdd);
};

// Express REST Methods
app.get('/', function (req, res) {
   console.log("GET /");
   res.send("Welcome to Demo App's Backend");
});

app.get('/devices', function (req, res) {
   console.log("GET /devices");

   // Find all data in the devices collection
   DeviceModel.find(function (err, devices) {
     if (err) {
       console.log(err);
       res.send('Error 404: Could not find device.' + err);
     }

     console.log(devices)
     res.send(devices);
   });
});

app.post('/devices', function(req, res) {
  console.log('POST /devices, Source IP : ' + req.connection.remoteAddress);
  console.log('Received JSON :  ' + JSON.stringify(req.body));

  if (!req.body.hasOwnProperty('mac_id')) {
    res.statusCode = 400;
    console.log('Post parameters incorrect');
    console.log('');
    return res.send('Error 400: Post parameters incorrect.');
  }

  // check if the device is already present in the db, based on mac_id
  DeviceModel.find({ mac_id : req.body.mac_id}, function (err, devices) {
    if (devices.length > 0) {
      console.log('Device already present in DB');
      res.send('Device already present in DB');

    } else {
      // go ahead and add the device to DB
      addDeviceToDb(req, res);
    }
  });

});

app.listen(80, function() {
  console.log('Demo App Running!');
});

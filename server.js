const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const mongoose = require('mongoose');


//setup mongoose connection
mongoose.connection.on('error', function() {
  console.log('error connecting to database');
})

mongoose.connection.on('connected', function() {
  console.log('succesfully connected to database');
})
mongoose.connect(process.env.MONGODB_URI);

var models = require('./models/models');
var User = models.User;
var Job = models.Job;
var Follow = models.Follow;
var Apply = models.Apply;

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

//ROUTES
app.get('/allJobs', function(req, res) {
  Job.find(function(err, jobs) {
    if (err) {
      console.log("couldn't find all jobs");
      console.log(err);
    }
    res.json(jobs);
  })
});

app.post('/login', function(req, res) {
  User.findOne({username: req.body.username, password: req.body.password}, function(err, user) {
    if (err) {
      console.log("credentials are wrong");
    } else {
      res.json({success: true});
    }
  })
});


app.post('/register', function(req, res) {
  console.log(req.body);
  var newUser = new User({
    username: req.body.username,
    password: req.body.password,
    resume: req.body.resume
  });
  newUser.save(function(err) {
    if (err) {
      console.log('could not save new user');
    }
  });
  res.json({success: true});
});


app.post('/newfollow', function(req, res) {
  var newFollow = new Follow({
    user: req.body.user,
    job: req.body.job
  });
  newFollow.save(function(err) {
    if (err) {
      console.log('could not save new follow');
    }
  });
});


app.post('/newapply', function(req, res) {
  var newApply = new Apply({
    user: req.body.user,
    job: req.body.job
  });
  newApply.save(function(err) {
    if (err) {
      console.log('could not save new apply');
    }
  });
})


// DO NOT REMOVE THIS LINE :)
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 1337);

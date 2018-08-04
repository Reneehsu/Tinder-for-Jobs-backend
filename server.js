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
var Recruiter = models.Recruiter;

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

app.post('/login/user', function(req, res) {
  User.findOne({username: req.body.username, password: req.body.password}, function(err, user) {
    if (err) {
      console.log("credentials are wrong");
    } else {
      res.json({success: true});
    }
  })
});


app.post('/register/user', function(req, res) {
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

app.post('/follow', function(req,res){
  //return an array of company
  console.log('follow');
  console.log('user',req.body.user);
  Follow.find({user:req.body.user},function(err,follows){
    if (err){
      console.log(err);
    } else {
      console.log('follows',follows);
      var promises = follows.map((follow) => {
        return Job.findOne({username:follow.job})
      })
      console.log('promises',promises);
      Promise.all(promises)
      .then(jobs=>{
        console.log('jobs',jobs);
        res.json(jobs);

      })
    }
  })
})




app.post('/apply',function(req,res){
  console.log('apply');
  console.log('user',req.body.user);
  Apply.find({user:req.body.user},function(err,applies){
    if (err){
      console.log(err);
    } else {
      console.log('applies',applies);
      var bool = [];
      var promises = applies.map((apply) => {
        bool.push(apply.match);
        return Job.findOne({username:apply.job})
      })
      Promise.all(promises)
      .then(jobs=>{
        console.log('jobs',jobs);
        res.json({
          job:jobs,
          bool:bool
        });
      })
    }
  })
})


///////////RECRUITER///////////////
app.post('/register/recruiter', function(req, res) {
  console.log(req.body);
  var newJob = new Job({
    username: req.body.username,
    password: req.body.password,
    company:req.body.company,
    title:req.body.title,
    description:req.body.description,
    logo:req.body.logo,
  });
  newJob.save(function(err) {
    if (err) {
      console.log('could not save new user');
    }
  });
  res.json({success: true});
});

// app.post('/register/recruiter', function(req, res) {
//   console.log(req.body);
//   var newRecruiter = new Recruiter({
//     username: req.body.username,
//     password: req.body.password
//   });
//   newRecruiter.save(function(err) {
//     if (err) {
//       console.log('could not save new user');
//     }
//   });
//   res.json({success: true});
// });

app.post('/login/recruiter', function(req, res) {
  Job.findOne({username: req.body.username, password: req.body.password}, function(err, user) {
    if (err) {
      console.log("credentials are wrong");
    } else {
      res.json({success: true});
    }
  })
});

// app.post('/login/recruiter', function(req, res) {
//   Recruiter.findOne({username: req.body.username, password: req.body.password}, function(err, user) {
//     if (err) {
//       console.log("credentials are wrong");
//     } else {
//       res.json({success: true});
//     }
//   })
// });

// app.post('/postjob',function(req,res){
//   var newJob = new Job({
//     company:req.body.company,
//     title:req.body.title,
//     description:req.body.description,
//     logo:req.body.logo,
//     recruiter: req.body.recruiter
//   });
//   newJob.save((err) =>{
//     if(err){
//       console.log(err)
//     } else {
//       res.send({success:true});
//     }
//   });
// })

app.post('/allusers', function(req,res){
  //jobid,
  Apply.find({job:req.body.job}, function(err,applies){
    if (err){
      console.log(err);
    } else {
      console.log("outside everything ", applies);
      var users = [];
      var promises = applies.map((apply) => {
        return User.findOne({username:apply.user})
      })
      Promise.all(promises)
      .then(users=>{
        res.json(users);
      })
    }
  })
})

app.post('/match',function(req,res){
  //username of the job , username of the user
  Apply.findOneAndUpdate({user:req.body.user, job:req.body.job},{match:true},function(err, theApply){
    if(err){
      console.log(err);
    } else {
      res.send({success:true});
    }
  })
})


// DO NOT REMOVE THIS LINE :)
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 1337);

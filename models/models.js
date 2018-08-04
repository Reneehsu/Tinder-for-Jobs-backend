var mongoose = require('mongoose');

if (!process.env.MONGODB_URI){
  console.log('Error: MONGODB_URI NOT SET');
  process.exit(1);
}

var userSchema = {
  username: {
    type: String
  },
  password: {
    type: String
  },
  resume: {
    type: String
  }
}



var jobSchema = {
  company: {
    type: String
  },
  title: {
    type: String
  },
  description: {
    type: String
  },
  logo: {
    type: String
  }
}




var followSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  job: {
    type: mongoose.Schema.ObjectId,
    ref: "Job"
  }
});




var applySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  job: {
    type: mongoose.Schema.ObjectId,
    ref: "Job"
  },
  match: {
    type: Boolean,
    default: false
  }
});


var User = mongoose.model("User", userSchema);
var Job = mongoose.model("Job", jobSchema);
var Follow = mongoose.model("Follow", followSchema);
var Apply = mongoose.model("Apply", applySchema);

module.exports = {
  User: User,
  Job: Job,
  Follow: Follow,
  Apply: Apply
}

const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  address: String,
  skills: String,
  hobbies: String,
  photo: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Submission', SubmissionSchema);

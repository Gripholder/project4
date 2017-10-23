const mongoose = require('mongoose');

let db = mongoose.connection;

db.on('error', err => {
  console.log(err);
});

db.once('open', () => {
  console.log("database has been connected!");
});

let AnswerSchema = new mongoose.Schema({
  answer: String,
  time : { type : Date, default: Date.now }
})

let RequestSchema = new mongoose.Schema({
  request: String,
  answers: [AnswerSchema],
  time : { type : Date, default: Date.now }
})



// mongoose.connect('mongodb://default:123456@ds227525.mlab.com:27525/ia');
mongoose.connect('mongodb://default:123456@ds227525.mlab.com:27525/ia');

mongoose.model("Request", RequestSchema);
mongoose.model("Answer", AnswerSchema);

module.exports = mongoose

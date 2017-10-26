const mongoose = require('mongoose');

let db = mongoose.connection;

db.on('error', err => {
  console.log(err);
});

db.once('open', () => {
  console.log("database has been connected!");
});


let RequestSchema = new mongoose.Schema({
  request: { type: String, exists: true},
  answer: {type: String, exists: true},
  time : { type : Date, default: Date.now }
})



// mongoose.connect('mongodb://default:123456@ds227525.mlab.com:27525/ia');
mongoose.connect('mongodb://default:123456@ds227525.mlab.com:27525/ia');

mongoose.model("Request", RequestSchema);

module.exports = mongoose

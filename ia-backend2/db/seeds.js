const mongoose = require('./connection.js')
const seedData = require('./seeds.json')
let Request = mongoose.model("Request")



Request.remove({}).then(() => {
  Request.collection.insert(seedData).then(() => {
    process.exit()
  })
})

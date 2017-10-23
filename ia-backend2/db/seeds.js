const mongoose = require('./connection.js')
const seedData = require('./seeds.json')
let Request = mongoose.model("Request")
let Answer = mongoose.model("Answer")


console.log(seedData[0].answers)
Answer.remove({}).then(() => {
  Answer.collection.insert(seedData[0].answers).then(() => {
    process.exit()
  })
})

Request.remove({}).then(() => {
  Request.collection.insert(seedData).then(() => {
    process.exit()
  })
})

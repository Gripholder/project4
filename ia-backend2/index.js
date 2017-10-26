const express = require("express")
const parser = require('body-parser')
const app = express()
const cors = require('cors')
const mongoose = require('./db/connection.js')
const Request = mongoose.model("Request")
app.set("view engine", "hbs")



app.listen(4000, () => {
  console.log("app listening on port 4000")
})

app.use(express.static(__dirname + '/public'))

app.use(cors())

app.use(parser.json({extended:true}));

app.get('/', (req, res) => {
  Request.find({}).then(text =>
  res.json(text))
})


app.get('/:text', (req, res) => {
  let text = req.params.text.toLowerCase()
  console.log(`second Answer console log:`)
  Request.findOne({request: text}).then(response => {
  if(response){
  res.json(response)
} else {
    console.log(response)
    res.json(null)
}})})

app.post('/', (req, res) => {
  console.log(req.body)
  Request.create({request: req.body.request.toLowerCase(), answer: req.body.answer.toLowerCase()}).then(text =>
      res.json(text))
    .catch(err =>
      res.json(err)
    )
  })

  // Update Answers
  app.post('/:text', (req, res) => {
    Request.findOneAndUpdate({request: req.params.text}, req.body, {new: true}).then(response => {
      res.json(response)
    })
  })

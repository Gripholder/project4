const express = require("express")
const parser = require('body-parser')
const app = express()
const cors = require('cors')
const mongoose = require('./db/connection.js')
const Request = mongoose.model("Request")
const Answer = mongoose.model("Answer")
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
  console.log(`first Answer console log: ${Answer.find({})}`)
  Request.findOne({request: text}).then(response => {
  if(response){
  let textPicker = response.answers[Math.floor(Math.random() * response.answers.length)]
  console.log(textPicker)
  res.json(textPicker)
} else {
  Request.find({}).then(request => {

    console.log(request)
  })
  // Answer.findOne({answer: text}).then(text => {
  //   res.json(text)
  // })
}})})

app.post('/', (req, res) => {
  Request.findOne({request: req.body.request.toLowerCase()})
  Request.create(req.body).then(text =>
      res.json(text))
    .catch(err =>
      res.json(err)
    )
  })

app.post('/:text', (req, res) => {
  let text = req.params.text
  Request.create({content: text}).then(text => {
    res.redirect("/")
  })
})

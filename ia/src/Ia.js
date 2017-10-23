import React, { Component } from 'react';
import axios from 'axios'

class Ia extends Component {
  constructor(props){
    super(props)
    this.state = {
      text: "",
      response: "",
      unknown: false,
      newText: ""
    }
    this.setText = this.setText.bind(this)
    this.processText = this.processText.bind(this)
    this.learnText = this.learnText.bind(this)
  }

  componentDidMount(){
  }

// Changing text state to inserted text
  setText(e){
    e.preventDefault()
    this.setState({
      text: e.target.value
    })
    console.log(this.state.text)
  }

// Annalizing text and assigning response
  processText(){
    axios.get(`http://localhost:4000/${this.state.text}`).then((response) => {
      console.log(response)
      if(response.data){
      this.setState({
        response: response.data,
      })
      console.log(this.state.responsePicker)
    } else {
      this.setState({
        response: "Oh, Wait a minute....",
        unknown: true
      })
      this.gatherAnswer
    }})
  }

// Changing newText state to inserted text
  learnText(e){
    e.preventDefault()
    this.setState({
      newText: e.target.value
    })
  }

  gatherAnswer(e){
    e.preventDefault()
    axios.post(`http://localhost:4000`, {request: this.state.text, answer: this.state.newText})
    .then(response => {
      console.log(response)
      this.processText()
      // this.setState({
      //   response: response.data.answer
      // })
    })
  }


  render() {

    let learn =
    <div>
    <h3>Please help me learn by giving me an idea of an appropriate response down below...</h3>
    <input onChange={(e) => this.learnText(e) }></input><button onClick={(e) => this.gatherAnswer(e) }>Submit</button></div>
    return (
      <div>
        <input onChange={(e) => this.setText(e) }></input><button onClick={ this.processText }>Submit</button>
        <h1>{ this.state.response.answer }</h1>
        { this.state.unknown && learn }
      </div>
    );
  }
}

export default Ia;

import React, { Component } from "react";
import axios from "axios";
import './App.css'

class Ia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      response: "",
      unknown: false,
      newText: "",
      process_speech: "",
      index: 1,
      currentInput: "result",
      voice: "",
      voices: [],
      volume: 0.5,
      rate: 0.5,
      pitch: 0.5
    };
    this.setText = this.setText.bind(this);
    this.processText = this.processText.bind(this);
    // this.processText2 = this.processText2.bind(this);
    this.learnText = this.learnText.bind(this);
    this.speechToText = this.speechToText.bind(this);
    this.controller = this.controller.bind(this);
    this.textToSpeech = this.textToSpeech.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.loadVoices = this.loadVoices.bind(this);
  }

  componentDidMount() {
    console.log("Component did mount");
    if (!window.speechSynthesis) {
      alert(
        "Your browser is not supported. If google chrome, please upgrade!!"
      );
    }
    window.speechSynthesis.onvoiceschanged = function(e) {
      this.loadVoices();
    }.bind(this);
    document.addEventListener(
      "keydown",
      function(event) {
        if (event.keyCode === 32) {
          console.log("Space Event listener working");
          if(this.state.index === 1){
            this.speechToText()
            this.setState({
              currentInput: "result2",
              index: 2
            })
            console.log(this.state.index)
          } else if (this.state.index === 2) {
            if(!this.state.response){
              this.setState({
                currentInput: "result2"
              })
              this.speechToText()
            } else {
              this.setState({
                currentInput: "result",
                index: 1
              })
              console.log(this.state.index)
            }
          }
          // let text = document.getElementById("result2").textContent
          // if(text === "Please help me learn by giving me an idea of an appropriate response
          // down below..."){
          //   this.setState({
          //     currentInput: 'result2'
          //   })
          //   this.speechToText()
          // } else {
          //   this.setState({
          //     currentInput: 'result'
          //   })
            // this.speechToText();

          // }
            // this.setState({
            //   index: 2
            // })
        }
      }.bind(this)
    );
  }

  // Changing text state to inserted text
  setText(e) {
    e.preventDefault();
    this.setState({
      text: e.target.value
    });
    console.log(this.state.text);
  }

  // Annalizing text and assigning response
  processText() {
    console.log("processText function started running");
    let resultValue = this.state.text;
    console.log(resultValue);
    axios
      .get(`http://localhost:4000/${resultValue}`)
      .then(response => {
        console.log(response);
        if (response.data) {
          this.setState({
            response: response.data,
            index: 2,
            currentInput: "result2"
          });
          if (this.state.currentInput === "result2") {
            this.textToSpeech();
          }
          console.log(this.state.response);
        } else {
          this.setState({
            unknown: true,
            currentInput: "result2",
            index: 2
          });
          this.textToSpeech()
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  // processText2() {
  //   console.log("processText2 function started running");
  //   axios
  //     .post(`http://localhost:4000/`, {
  //       this.state.text,
  //       this.state.newText
  //     })
  //     .then(response => {
  //       console.log(response);
  //       if (response.data) {
  //         this.setState({
  //           response: response.data
  //         });
  //         console.log(this.state.response);
  //       } else {
  //         this.setState({
  //           response: "Oh, Wait a minute....",
  //           unknown: true
  //         });
  //         this.gatherAnswer;
  //       }
  //     });
  // }

  // Changing newText state to inserted text
  learnText(e) {
    e.preventDefault();
    console.log("Learning text");
    this.setState({
      newText: e.target.value
    });
  }

  gatherAnswer(e) {
    e.preventDefault();
    console.log("Gather answer function started running");
    console.log(this.state.text);
    console.log(this.state.newText);
    axios
      .post(`http://localhost:4000`, {
        request: this.state.text,
        answer: this.state.newText
      })
      .then(response => {
        this.processText();
        this.setState({
          response: response.data.answer
        });
        console.log(response);
      });
  }

  speechToText() {

    let self = this;

    console.log("speechToText function started running");
    if (window.webkitSpeechRecognition) {
      var speechRecognizer = new window.webkitSpeechRecognition();
      speechRecognizer.continuous = false;
      speechRecognizer.interimResults = true;
      speechRecognizer.lang = "en-US";
      speechRecognizer.start();

      if(self.state.currentInput === "result"){
        var r = document.getElementById("result")
      } else {
        var r = document.getElementById("result2")
      }

      var finalTranscripts = "";

      speechRecognizer.onresult = function(event) {
        var interimTranscripts = "";
          var transcript = event.results[0][0].transcript;
          transcript.replace("\n", "<br>");
          if (event.results[0].isFinal) {
            console.log(event)
              finalTranscripts += transcript;
              if(self.state.currentInput === "result"){
                self.gatherAnswer()
              } else {
                  self.processText()
              }

              self.processText()
        } else {
          interimTranscripts += transcript
        }
        r.innerHTML = `${finalTranscripts}<span style="color:#999">${interimTranscripts}</span>`
      console.log(r.textContent)
      self.setState({
        currentInput: "result2",
        text: r.textContent
      });
      console.log(`Setting answer text to ${self.state.newText}`);
      console.log(`Setting request text to ${self.state.text}`);
    }
      speechRecognizer.onerror = function(event) {
        console.log(event)
        console.log(`Speech Recognizer error line 218`)
      };
    } else {
      r.innerHTML =
        "Your browser is not supported. If google chrome, please upgrade!";
    }
  }

  loadVoices() {
    console.log("Load Voices initiated");
    var voices = window.speechSynthesis.getVoices();
    this.setState({ voices });
  }

  textToSpeech() {
    var voiceOptions = document.getElementById("voiceOptions");

      var myText = document.getElementById("result2").textContent;

    // function speak() {
    console.log("Speak function running");

    let voices = speechSynthesis.getVoices();

    var msg = new SpeechSynthesisUtterance();
    msg.volume = this.state.volume;
    msg.voice = voices[this.state.voice];
    msg.rate = this.state.rate;
    msg.Pitch = this.state.pitch;
    msg.text = myText;
    window.speechSynthesis.speak(msg)
    console.log(voiceOptions.options[voiceOptions.selectedIndex].textContent);
    // if(myText){
    //   this.setState({
    //     currentInput: "result2",
    //     index: 1
    //   })
    // }
    if(this.state.response){
      this.setState({
        currentInput: "result"
      })
    } else {
      this.setState({
        currentInput: "result2"
      })
    }
    // let test = 'Please help me learn by giving me an idea of an appropriate response
    // down below...'
    // if(myText === test){
    //   this.setState({
    //     currentInput: "result2"
    //   })
    //   this.speechToText()
    // } else {
    //   this.setState({
    //     currentInput: "result"
    //   })
    // }
  }

  processVoice(e) {
    e.preventDefault();
    let x = document.getElementById("voiceOptions");
    console.log(x.options[x.selectedIndex].value);
    this.setState({
      voice: e.target.value
    });
  }

  changeVolume(e) {
    this.setState({
      volume: e.target.value
    });
    console.log(e.target.value);
  }

  changeRate(e) {
    this.setState({
      rate: e.target.value
    });
    console.log(e.target.value);
  }

  changePitch(e) {
    this.setState({
      pitch: e.target.value
    });
    console.log(e.target.value);
  }

  controller() {
    // let index = 1;
    // document.addEventListener("keydown", function(event) {
    //   if (event.keyCode == 32) {
    //     console.log("Space Event listener working");
    //     if (index === 1) {
    //       console.log("index = 1");
    //       this.speechToText;
    //       index++;
    //     } else {
    //       console.log("index = 2");
    //       index--;
    //     }
    //   }
    // });
  }

  render() {
    let learn = (
      <div>
        <div id="result2">
          Please help me learn by giving me an idea of an appropriate response
          down below...
        </div>
        <button onClick={this.speechToText}>Start</button>
        <button onClick={e => this.gatherAnswer(e)}>Done!</button>
      </div>
    );
    return (
      <div className="controller">
        <div className="container">
          <div id="voice">
          <label>
            <span>Voice</span>
            <select id="voiceOptions" onChange={e => this.processVoice(e)}>
              {this.state.voices.map((voice, index) => <option value={index}>{voice.name}</option>
              )}
            </select>
          </label>
        </div>
          <label>
            <span>Volume</span>
            <input
              type="range"
              id="volumeSlider"
              min="0"
              max="1"
              step="0.1"
              onChange={e => this.changeVolume(e)}
            />
          </label>
          <label>
            <span>rate</span>
            <input
              type="range"
              id="rateSlider"
              min="0"
              max="1"
              step="0.1"
              onChange={e => this.changeRate(e)}
            />
          </label>
          <label>
            <span>Pitch</span>
            <input
              type="range"
              id="pitchSlider"
              min="0"
              max="2"
              step="0.1"
              onChange={e => this.changePitch}
            />
          </label>
          <div className="button" onClick={this.textToSpeech}>
            Speak
          </div>
          {this.controller()}
        </div>
        <div>
        <div id="result" />
        <button onClick={this.speechToText}>
        Start
        </button>
        <button onClick={this.processText}>Done!</button>
        <h1 id="responseSpeech">{this.state.response.answer}</h1>
        {this.state.unknown && learn}
      </div>
          </div>
    );
  }
}

export default Ia;

import React, { Component } from 'react'

class Game extends Component {
  constructor() {
    super()
    this.state = {
      playing: false,
      startGame: false,
      gameOver: false,
      currentWord: "",
      currentAnagrams: [],
      allWords:[],
      allAnagrams: [],
      gameTimer: 120,
      gameTimeLeft: "",
      wordTimer: 15,
      score: 0
    }
    this.gameInterval = 0;
    this.wordInterval = 0;
    this.startTimer = this.startTimer.bind(this)
    this.countDown = this.countDown.bind(this)
  }

  handleButton = () => {
    this.setState({startGame: true, playing: true}, this.startTimer)
  }

  startTimer = () => {
    // console.log('I was triggered', this.state.startGame, this.state.playing)
    if (this.gameInterval === 0) {
      this.gameInterval = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    let seconds = this.state.gameTimer - 1;
    this.setState({
      gameTimer: seconds,
      gameTimeLeft: this.getTime(seconds)
    });

    if (seconds == 0) {
      clearInterval(this.gameInterval);
    }
  }

  getTime = (seconds) => {
    let min = Math.floor(seconds / 60).toString()
    let sec = Math.floor(seconds % 60)

    if (sec < 10) {
      sec = '0' + sec
    } else {
      sec = sec.toString()
    }

    return `${min}:${sec}`
  }



  playGame = () => {
    return(
      <React.Fragment>
        <h3>{this.state.gameTimeLeft}</h3>
      </React.Fragment>
    )
  }

  render() {
    return (
      <div>
        {(this.state.startGame === true) ? null :
          <React.Fragment>
          <h2>Instructions</h2>
          <p>Try to solve as many anagrams using all the letters displayed</p>
          <p>You will be penalized for guesses that are incorrect or do not use all the letters</p>
          <p>You will have 15 seconds to unscramble each word</p>
          <p>If you've guessed all the possible anagrams (MUST USE ALL LETTERS), the next word will be displayed and the word timer will be reset to 15 seconds</p>
          <p>The game ends when the game timer reaches 0. Good luck!</p>
          <button onClick={this.handleButton}>Start</button>
          </React.Fragment>
        }

        {(this.state.playing === false) ? null : this.playGame()}
      </div>
    )
  }

}

export default Game;

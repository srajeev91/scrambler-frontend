import React, { Component } from 'react'
import UUID from 'uuid'

class Game extends Component {
  constructor() {
    super()
    this.state = {
      playing: false,
      startGame: false,
      gameOver: false,
      wordLength: 4,
      wordsOfLength: [],
      currentWord: "word",
      scrambled: "",
      currentAnagrams: [],
      allWords:[],
      allAnagrams: [],
      gameTimer: 120,
      gameTimeLeft: "2:00",
      wordTimer: 15,
      score: 0,
      playerGuess: "",
      allGuesses: [],
      allWordGuesses: [],
      wordCorrectGuesses: []
    }
    this.gameInterval = 0;
    this.wordInterval = 0;
    //I don't need to do this since I passed in an arrow function as my callback
    // this.startTimer = this.startTimer.bind(this)
    // this.countDown = this.gameCountDown.bind(this)
  }

  handleButton = () => {
    this.setState({startGame: true, playing: true}, () => {this.getWord()})
  }

  startTimer = () => {
    // console.log('I was triggered', this.state.startGame, this.state.playing)
    if (this.gameInterval === 0) {
      this.gameInterval = setInterval(() => {this.gameCountDown()}, 1000);
    }
    this.startWordTimer()
  }

  startWordTimer = () => {
    if (this.wordInterval === 0) {
      this.wordInterval = setInterval(() => {this.wordCountDown()}, 1000);
    }
  }

  wordCountDown() {
    let seconds = this.state.wordTimer - 1;
    this.setState({
      wordTimer: seconds,
    });

    if (seconds === 0) {
      clearInterval(this.wordInterval);
      this.getWord()
    }
  }

  gameCountDown() {
    let seconds = this.state.gameTimer - 1;
    this.setState({
      gameTimer: seconds,
      gameTimeLeft: this.getTime(seconds)
    });

    if (seconds === 0) {
      clearInterval(this.gameInterval);
      clearInterval(this.wordInterval);
      this.setState({wordTimer: 0}, () => {this.endGame()})
    }
  }

  endGame = () => {
    console.log('do post requests for score, allAnagrams, allWords??')
    console.log('set state for gameover:true, playing: false')
    console.log('if playing is true, render component that goes through all anagrams')
    console.log(this.state)
  }

  getWord () {
    if (this.state.wordTimer !== 0) {
      clearInterval(this.wordInterval);
    }

    if (this.state.gameTimer > 0) {
      fetch('http://localhost:3000/api/v1/words', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
      })
      .then((response) => response.json())
      .then(data => this.setState({
        wordsOfLength: data.filter(wordObj => wordObj.length == this.state.wordLength)
      }, () => {this.setWord()}))
    }

  }

  setWord = () => {
    let wordGuesses = this.state.allWordGuesses.slice(0)
    let gameGuesses = this.state.allGuesses.slice(0)
    gameGuesses.push(wordGuesses)

    this.setState({
      allGuesses: gameGuesses,
      wordCorrectGuesses: [],
      allWordGuesses: [],
      currentWord: this.state.wordsOfLength[Math.floor(Math.random() * this.state.wordsOfLength.length)].word
    }, () => {this.setScramble()})
  }

  setScramble = () => {
    let wordsarray = this.state.allWords.slice(0)
    wordsarray.push(this.state.currentWord)
    let newWordTimer = 0

    if (this.state.gameTimer >= 15) {
      newWordTimer = 15
    } else if (0 < this.state.gameTimer < 15) {
      newWordTimer = this.state.gameTimer
    }

    this.setState({
      allWords: wordsarray,
      wordTimer: newWordTimer,
      scrambled: this.randomize(this.state.currentWord)
    }, () => {this.fetchAnagrams()})
  }

  fetchAnagrams = () => {
    this.wordInterval = setInterval(() => {this.wordCountDown()}, 1000);

    fetch(`https://danielthepope-countdown-v1.p.mashape.com/solve/${this.state.currentWord}`, {
      method: 'GET',
      headers: {"X-Mashape-Key": "3XF6f6Tv0qmshjUbmH9AGCF0avHCp1QKdsxjsnW60gPqAQQWUK",
    "Accept": "application/json"}
    }).then(response => response.json())
    .then(
      data => this.setState({
        currentAnagrams: data.map(wordObj => wordObj.word.toLowerCase())
      }, () => {this.updateAllAnagrams()})
    )

  }

  updateAllAnagrams = () => {
    let allWordAnagrams = this.state.allAnagrams.slice(0)
    allWordAnagrams.push(this.state.currentAnagrams)
    this.setState({allAnagrams: allWordAnagrams})

    if (this.state.gameTimer === 120) {
      this.startTimer()
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

  randomize = (word) => {
    let original = word.toLowerCase()
    let scrambled = ''
    word = word.toLowerCase().split('')
    while (word.length > 0) {
      scrambled += word.splice(Math.floor(word.length * Math.random()), 1)
    }

    while (scrambled === original) {
      scrambled = ''
      word = original.toLowerCase().split('')
      while (word.length > 0) {
        scrambled += word.splice(Math.floor(word.length * Math.random()), 1)
      }
    }
    return scrambled
  }

  handleChange = (event) => {
    this.setState({playerGuess: event.target.value})
  }

  handleSubmit = (event) => {
    event.preventDefault()
    console.log(this.state.currentAnagrams)

    let currentGuess = this.state.playerGuess.toLowerCase()
    let playerGuesses = this.state.allWordGuesses.slice(0)
    playerGuesses.push(currentGuess)
    let unique = [...new Set(playerGuesses)]

    this.setState({
      playerGuess: "",
      allWordGuesses: unique,
    }, () => {this.wordValidity(currentGuess)})
  }

  wordValidity = (word) => {
    let correctGuesses = this.state.wordCorrectGuesses.slice(0)

    if (this.state.currentAnagrams.includes(word) || word == this.state.currentWord) {
      correctGuesses.push(word)
      this.setState({
        wordCorrectGuesses: correctGuesses
      }, () => {this.victoryCondition()})
    } else {
      this.failureCondition()
    }
  }

  victoryCondition = () => {
    let array1 = this.state.currentAnagrams.slice(0)
    let array2 = this.state.wordCorrectGuesses.slice(0)
    let currentScore = this.state.score
    currentScore += this.state.wordLength

    this.setState({score: currentScore})

    if (array1.sort().join(',')=== array2.sort().join(',')) {
      this.getWord()
    }
  }

  failureCondition = () => {
    let currentScore = this.state.score - 1
    this.setState({score: currentScore})
  }

  playGame = () => {
    return(
      <div className="game-timer">
        <h1>{this.state.gameTimeLeft}</h1>
        <h3>{this.state.scrambled}</h3>
        <h4>{this.state.wordTimer}</h4>

        <p>Enter guesses here:</p>
        <form onSubmit={this.handleSubmit}>
          <input type="text" onChange={this.handleChange} value={this.state.playerGuess}/>
          <input type="submit" />
        </form>

        <h4>Your guesses:</h4>
        <ul>
          {this.state.allWordGuesses.map(word => <li key={UUID()}>{word}</li>)}
        </ul>

        <h4>Score: {this.state.score}</h4>
      </div>
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

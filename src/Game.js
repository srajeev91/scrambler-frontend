import React, { Component } from 'react'
import UUID from 'uuid'
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:5000');

socket.on("FromAPI", data => console.log(data))

class Game extends Component {
  constructor() {
    super()
    this.state = {
      playing: false,
      startGame: false,
      gameOver: false,
      gameId: 0,
      wordLength: 4,
      iteration: 0,
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
    console.log(this.props.id)
    fetch('http://localhost:3000/api/v1/games', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        user_id: Number(this.props.id),
        score: 0,
        date: String(new Date())
      })
    })
    .then(response => response.json())
    .then(data => {
      this.setState({
        gameId: data.id,
        startGame: true,
        playing: true
      }, () => {this.getWord()})

    })
  }

  startTimer = () => {
    // console.log('I was triggered', this.state.startGame, this.state.playing)
    if (this.gameInterval === 0) {
      this.gameInterval = setInterval(() => {this.gameCountDown()}, 1000);
    }
    console.log('startTimer', this.gameInterval)
  }

  startWordTimer = () => {
    // if (this.wordInterval === 0) {
      // clearInterval(this.wordInterval)
      this.wordInterval = setInterval(() => {this.wordCountDown()}, 1000);
      console.log('startWordTimer',this.wordInterval)
    // }
  }

  wordCountDown() {
    let seconds = this.state.wordTimer - 1;
    this.setState({
      wordTimer: seconds,
    });

    if (seconds === 0) {
      console.log('in wordCountDown', this.wordInterval)
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
    this.setState({
      playing: false,
      gameOver: true,
    })
    console.log('do post requests for score, allAnagrams, allWords??')
    console.log('set state for gameover:true, playing: false')
    console.log('if gameover is true, render component that goes through all anagrams')
    console.log(this.state)
    this.postScore()
  }

  postScore = () => {
    fetch(`http://localhost:3000/api/v1/user_games/${this.state.gameId}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        score: this.state.score,
        user_id: Number(this.props.id),
        game_id: Number(this.state.gameId)
      })
    })
  }

  getWord () {
    if (this.state.wordTimer !== 0) {
      console.log('in get word', this.wordInterval)
      clearInterval(this.wordInterval);
    }

    if (this.state.iteration > 3) {
      this.setState({
        iteration: 1,
        wordLength: this.state.wordLength + 1
      }, () => {this.getWordTwo()})
    } else {
      this.setState({iteration: this.state.iteration + 1}, () => {this.getWordTwo()})
    }
  }

  getWordTwo = () => {
    let allwords = this.props.words

    if (this.state.gameTimer > 0 && this.state.iteration === 1) {
      this.setState({
        wordsOfLength: allwords.filter(wordObj => wordObj.length === this.state.wordLength)
      }, () => {this.setWord()})
    } else {
      this.setWord()
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

    this.setState({
      allWords: wordsarray,
    }, () => {this.fetchAnagrams()})
  }

  fetchAnagrams = () => {


    fetch(`https://danielthepope-countdown-v1.p.mashape.com/solve/${this.state.currentWord}`, {
      method: 'GET',
      headers: {"X-Mashape-Key": "3XF6f6Tv0qmshjUbmH9AGCF0avHCp1QKdsxjsnW60gPqAQQWUK",
    "Accept": "application/json"}
    }).then(response => response.json())
    .then(
      data => this.setState({
        scrambled: this.randomize(this.state.currentWord),
        currentAnagrams: data.map(wordObj => wordObj.word.toLowerCase())
      }, () => {
        this.updateAllAnagrams()
      })
    )

  }

  updateAllAnagrams = () => {
    let currentWordAnagrams = this.state.currentAnagrams.slice(0)
    if (currentWordAnagrams.length === 0) {
      currentWordAnagrams.push(this.state.currentWord)
    } else if (!currentWordAnagrams.includes(this.state.currentWord) && currentWordAnagrams[0].length===this.state.currentWord.length) {
      currentWordAnagrams.push(this.state.currentWord)
    } else if (!currentWordAnagrams.includes(this.state.currentWord)) {
      currentWordAnagrams = [this.state.currentWord]
    }

    let newWordTimer = 0

    if (this.state.gameTimer >= 15) {
      newWordTimer = 15
    } else if (0 < this.state.gameTimer < 15) {
      newWordTimer = this.state.gameTimer
    }


    let allWordAnagrams = this.state.allAnagrams.slice(0)
    allWordAnagrams.push(currentWordAnagrams)
    this.setState({
      currentAnagrams: currentWordAnagrams,
      allAnagrams: allWordAnagrams,
      wordTimer: newWordTimer
    })

    if (this.state.gameTimer === 120) {
      this.startTimer()
    }
    this.startWordTimer()
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

    if (correctGuesses.includes(word)) {
      return
    }

    if (this.state.currentAnagrams.includes(word) || word === this.state.currentWord) {
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
      <div className="game">
        <h1 className="game-timer">{this.state.gameTimeLeft}</h1>
        <h3 className="scrambled">{this.state.scrambled}</h3>
        <h4 className="word-timer">{this.state.wordTimer}</h4>

        <p>Enter guesses here:</p>
        <form className="guess-form" onSubmit={this.handleSubmit}>
          <input type="text" onChange={this.handleChange} value={this.state.playerGuess}/>
          <br />
          <input type="submit" />
        </form>

        <h4>Your guesses:</h4>
        <ul className="my-guesses">
          {this.state.allWordGuesses.map(word => <li key={UUID()}>{word}</li>)}
        </ul>

        <h4 className="score">Score: {this.state.score}</h4>
      </div>
    )
  }

  gameOver = () => {
    let anagrams = this.state.allAnagrams.map(arr => <p key={UUID()}>{String(arr)}</p>)

    return(
      <div className="your-guesses">
        <h2>YOUR GUESSES</h2>
        <h4>Score: {this.state.score}</h4>
        {anagrams}
      </div>
    )
  }

  componentWillUnmount() {
    console.log('componentWillUnmount', this.gameInterval, this.wordInterval)
    clearInterval(this.gameInterval);
    clearInterval(this.wordInterval);
  }

  render() {
    return (
      <div className="start">
        {(this.props.words.length === 0) ? <h2 className="alt-text">LOADING</h2> : null}
        {(this.state.startGame === true || this.props.words.length === 0) ? null :
          <div className="instructions">
          <h2>INSTRUCTIONS</h2>
          <p>Try to solve as many anagrams using all the letters displayed</p>
          <p>You will be penalized for guesses that are incorrect or do not use all the letters</p>
          <p>You will have 15 seconds to unscramble each word</p>
          <p>If you've guessed all the possible anagrams (MUST USE ALL LETTERS), the next word will be displayed and the word timer will be reset to 15 seconds</p>
          <p>The game ends when the game timer reaches 0. Good luck!</p>
          <button onClick={this.handleButton}>Start</button>
          </div>
        }

        {(this.state.playing === false) ? null : this.playGame()}

        {(this.state.gameOver === false) ? null : this.gameOver()}
      </div>
    )
  }

}

export default Game;

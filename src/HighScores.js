import React, { Component } from 'react'
import UUID from 'uuid'

class HighScores extends Component {
  state = {
    highScores: []
  }

  componentDidMount() {
    fetch('http://localhost:3000/api/v1/highscores')
    .then((response) => response.json())
    .then(data => {
      this.setState({
        highScores: data
      }, () => {this.renderScores()})
    })
  }

  renderScores = () => {
    console.log(this.state.highScores)
    return this.state.highScores.map(obj => (
      <li key={UUID()}>
        <h4>{this.parseDate(obj.date)}</h4>
        <p>Score: {obj.score}</p>
      </li>
    ))
  }

  parseDate = (date) => {
    let unparsed = new Date(date)
    //'Wed Jul 25 2018 17:46:17 GMT-0400 (EDT)'
    let weekday = date.split(' ')[0]
    let month = date.split(' ')[1]
    let day = date.split(' ')[2]
    let year = date.split(' ')[3]
    let hour = unparsed.getHours()
    let ampm = 'AM'
    let minutes = unparsed.getMinutes()

    if (hour === 12) {
      ampm = 'PM'
    } else if (hour > 12) {
      ampm = 'PM'
      hour = hour - 12
    } else if (hour === 0) {
      hour = 12
    }

    return `${weekday}, ${month} ${day}, ${year} - ${hour}:${minutes} ${ampm}`

  }

  render() {
    return (
      <div className="high-scores">
        <h2>High Scores</h2>
        <ul>
          {this.renderScores()}
        </ul>
      </div>
    )
  }

}

export default HighScores;

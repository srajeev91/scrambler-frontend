import React, { Component } from 'react'
import UUID from 'uuid'

const IP = `192.168.6.192`

class HighScores extends Component {
  state = {
    highScores: []
  }

  componentDidMount() {
    fetch(`http://${IP}:3000/api/v1/highscores`)
    .then((response) => response.json())
    .then(data => {
      this.setState({
        highScores: data
      }, () => {console.log('HIGHSCORES')})
    })
  }

  renderScores = () => {
    return this.state.highScores.map(obj => (
      <tr key={UUID()}>
        <td className="boldme">{obj.user.username.toUpperCase()}</td>
        <td>{obj.score}</td>
        <td>{this.parseDate(obj.date)}</td>
      </tr>
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

    if (String(minutes).length === 1) {
      minutes = '0' + minutes
    }

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
        <h2>HIGH SCORES</h2>
        <table className="games-table">
          <thead>
          <tr>
            <th>Username</th>
            <th>Score</th>
            <th>Date Played</th>
          </tr>
          </thead>
          <tbody>
            {this.renderScores()}
          </tbody>
        </table>
      </div>
    )
  }

}

export default HighScores;

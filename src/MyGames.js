import React, { Component } from 'react';

class MyGames extends Component {
  state = {
    games: [],
  }


  componentDidMount() {
    document.body.className = null;

    if (this.props.id !== 0) {
      fetch(
        `http://localhost:3000/api/v1/users/${this.props.id}/games`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem('token')
          }
        }
      )
      .then(res => {
        return res.json()
      })
      .then(d => {
        this.setState({
          games: d,
        });
      })
      .catch(err => {
        console.log('catch');
        this.setState({
          games: [],
        });
      })
    }
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

    let usergamesarray = this.state.games.slice(0).reverse().map(game => game.user_games)
    let mygamearrayofarrays = usergamesarray.filter(ug => Number(ug[0].user_id) === Number(this.props.id))
    let mygamearray = [].concat.apply([], mygamearrayofarrays)


    return (
      // {(Adapter.isLoggedIn()) ?
        <div className="my-games">
          <h2>MY GAMES</h2>
          { (this.state.games.length === 0) ? <h3 className="alt-text">You do not have any games yet!</h3> :
            <table className="games-table">
              <thead>
              <tr>
                <th>Date Played</th>
                <th>Score</th>
              </tr>
              </thead>
              <tbody>
              {mygamearray.map(
                game => (
                  // <li key={game.game_id}>
                  //   <h4>{this.parseDate(game.date)}</h4>
                  //   <p>Score: {game.score}</p>
                  // </li>
                  <tr key={game.game_id}>
                    <td>{this.parseDate(game.date)}</td>
                    <td>{game.score}</td>
                  </tr>
                )
              )}
              </tbody>
            </table> }
        </div>
        // : <h3>Sign Up or Log In</h3> }
    )
  }
}

export default MyGames;

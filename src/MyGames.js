import React, { Component } from 'react';
import Adapter from './Adapter'
// import SnackList from './SnackList';

class MyGames extends Component {
  state = {
    games: [],
  }

  componentDidMount() {
    this.getGames();
  }

  getGames = () => {
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


  render() {
    // console.log(this.state.games)
    // console.log(Adapter.isLoggedIn())
    console.log(this.props.id)
    let mygames = Array.from(this.state.games)

    return (
      // {(Adapter.isLoggedIn()) ?
        <div className="my-games">
          <h2>My Games</h2>
          { (this.state.games.length === 0) ? <h3>You do not have any games yet!</h3> : <ul>{mygames.map(game => <li key={game.id}>Game #{game.id}</li>)}</ul> }
        </div>
        // : <h3>Sign Up or Log In</h3> }
    )
  }
}

export default MyGames;

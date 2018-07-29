import React, { Component, Fragment } from 'react';
import { Route } from 'react-router-dom';
import NavBar from './NavBar';
import MyGames from './MyGames';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import Game from './Game';
import HighScores from './HighScores';
import Adapter from './Adapter';
import Home from './Home'
import Logo from './Logo'
import LogoutButton from './LogoutButton'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: 0,
      words: []
    }
  }

  componentDidMount(){
    let myId = localStorage.getItem('id')

    fetch('http://localhost:3000/api/v1/words')
    .then((response) => response.json())
    .then(data => this.setState({words: data, id: myId})
    )
  }

  setId = (id) => {
    this.setState({id: id}, () => {console.log(this.state.id)})
  }

  render() {
    console.log(this.props.AppCable)
    return (
        <div className="App">
          <NavBar />
          <Logo />
          <Route exact path="/" component={Home} />
          { Adapter.isLoggedIn() ?
              null
            :
              <Fragment>
                <Route exact path="/signup" component={(props) => <SignUpForm {...props} />} />
                <Route exact path="/login" component={(props) => <LoginForm {...props} setId={this.setId}/>} />
              </Fragment>
          }
          <Route exact path="/logout" component={LogoutButton} />
          <Route exact path="/my-games" component={() => <MyGames id={this.state.id} />} />
          <Route exact path="/high-scores" component={HighScores} />
          <Route exact path="/playgame" component={() => <Game id={this.state.id} words={this.state.words} />} />
        </div>
    );
  }
}

export default App;

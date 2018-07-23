import React, { Component, Fragment } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import NavBar from './NavBar';
import MyGames from './MyGames';
import SignUpForm from './SignUpForm';
import LoginForm from './LoginForm';
import Game from './Game';
import HighScores from './HighScores';
import Adapter from './Adapter';
import Home from './Home'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      id: 0
    }
  }

  setId = (id) => {
    this.setState({id: id}, () => {console.log(this.state.id)})
  }

  render() {
    // console.log(this.props)
    return (
        <div className="App">
          <NavBar />

          <Route exact path="/" component={Home} />
          { Adapter.isLoggedIn() ?
              null
            :
              <Fragment>
                <Route exact path="/signup" component={(props) => <SignUpForm {...props} />} />
                <Route exact path="/login" component={(props) => <LoginForm {...props} setId={this.setId}/>} />
              </Fragment>
          }
          <Route exact path="/my-games" component={() => <MyGames id={this.state.id} />} />
          <Route exact path="/high-scores" component={HighScores} />
          <Route exact path="/playgame" component={Game} />
        </div>
    );
  }
}

export default App;

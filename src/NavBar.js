import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import Adapter from './Adapter';


const NavBar = (props) => {
  return (
    <header className="nav">

        { Adapter.isLoggedIn() ?
            <Fragment>
              <NavLink activeClassName="selected" exact to="/logout">Log Out</NavLink>
              <NavLink activeClassName="selected" exact to="/my-games">My Games</NavLink>
              <NavLink activeClassName="selected" exact to="/highscores">High Scores</NavLink>
              <NavLink activeClassName="selected" exact to="/playgame">Play Game</NavLink>
            </Fragment>
            /*
            <button onClick={() => {
                Adapter.logout();
                props.history.push("/login");
              }}>Logout</button>
            */
          :
            <Fragment>
              <NavLink activeClassName="selected" exact to="/signup">Sign Up</NavLink>
              <NavLink activeClassName="selected" exact to="/login">Login</NavLink>
            </Fragment>
        }
    </header>
  )
}

export default NavBar;

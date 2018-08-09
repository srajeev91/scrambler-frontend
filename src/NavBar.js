import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import Adapter from './Adapter';


const NavBar = (props) => {
  return (
    <header className="nav">

        { Adapter.isLoggedIn() ?
            <Fragment>
              <NavLink activeClassName="selected" exact to="/logout">LOG OUT</NavLink>
              <NavLink activeClassName="selected" exact to="/my-games">MY GAMES</NavLink>
              <NavLink activeClassName="selected" exact to="/high-scores">HIGH SCORES</NavLink>
              <NavLink activeClassName="selected" exact to="/playgame">PLAY GAME</NavLink>
            </Fragment>
            /*
            <button onClick={() => {
                Adapter.logout();
                props.history.push("/login");
              }}>Logout</button>
            */
          :
            <Fragment>
              <NavLink activeClassName="selected" exact to="/signup">SIGN UP</NavLink>
              <NavLink activeClassName="selected" exact to="/login">LOGIN</NavLink>
            </Fragment>
        }
    </header>
  )
}

export default NavBar;

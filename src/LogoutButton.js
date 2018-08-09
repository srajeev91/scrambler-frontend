import React from 'react';
import Adapter from './Adapter';
import { withRouter } from 'react-router';

const LogoutButton = ({ to = "/login", history}) => {
    Adapter.logout()
    history.push(to)
    return (
      // <button
      //   className="logout-button"
      //   onClick={() => {
      null

      //   }}
      // >
      //   Logout
      // </button>
    )
}

export default withRouter(LogoutButton);

import React from 'react';
import Adapter from './Adapter';
import { withRouter } from 'react-router';

const LogoutButton = ({ to = "/login", history}) => {
    return (
      <button
        className="logout-button"
        onClick={() => {
          Adapter.logout();
          history.push(to);
        }}
      >
        Logout
      </button>
    )
}

export default withRouter(LogoutButton);

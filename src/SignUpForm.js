import React, { Component } from 'react';

const IP = window.location.hostname
// `192.168.6.120`

class SignUpForm extends Component {
  state = {
    username: "",
    password: "",
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();

    fetch(`http://${IP}:3000/api/v1/users/`, {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(json => {
        // console.log(json);
        // localStorage.setItem('token', json.token);
        this.props.history.push("/login");
      })
  }

  componentWillMount () {
    document.body.className = 'tinted-image'
  }

  render() {
    return (
      <div className="signup">
        <h1 className="signup-form">REGISTER</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={this.handleChange}
            value={this.state.username}
          />
          <br />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={this.handleChange}
            value={this.state.password}
          />
          <input type="submit" value="Sign Up" />
        </form>
      </div>
    )
  }
}

export default SignUpForm;

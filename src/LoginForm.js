import React, { Component } from 'react';

class LoginForm extends Component {
  state = {
    username: "",
    password: "",
    id: 0
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();

    fetch(`http://localhost:3000/api/v1/sessions/`, {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(json => {
        this.props.setId(json.id)
        // this.setState({id: json.id}, () => {
        //   console.log(this.state.id)
          localStorage.setItem('token', json.token);
          this.props.history.push("/my-games");
        // })
      })
  }

  render() {
    // console.log(this.props)
    return (
      <div className="login">
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={this.handleChange}
            value={this.state.username}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={this.handleChange}
            value={this.state.password}
          />
          <input type="submit" value="Login" />
        </form>
      </div>
    )
  }
}

export default LoginForm;
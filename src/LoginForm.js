import React, { Component } from 'react';

const IP = window.location.hostname
// `192.168.6.120`

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

    fetch(`http://${IP}:3000/api/v1/sessions/`, {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(json => {
        if(json.id == undefined) {
          alert('Please enter valid username and password')
        } else {
          this.props.setId(json.id)
        // this.setState({id: json.id}, () => {
        //   console.log(this.state.id)
          localStorage.setItem('token', json.token);
          localStorage.setItem('id', json.id);
          this.props.history.push("/my-games");
        }
        // })
      })
  }

  componentWillMount(){
    // document.body.style.backgroundImage = `url('https://www.the-efa.org/wp-content/uploads/2018/01/scrabble-1615793_1920.jpg')`;
    // document.body.style.backgroundImage = `url('https://s3.envato.com/files/121873343/preview.jpg')`;
    // document.body.style.backgroundImage = `url('https://i.etsystatic.com/5308878/r/il/919f11/625381037/il_570xN.625381037_384c.jpg')`;
    document.body.className = 'tinted-image'
  }

  render() {
    // document.body.style.backgroundImage = `url('https://www.the-efa.org/wp-content/uploads/2018/01/scrabble-1615793_1920.jpg')`;

    return (
      <div className="login">
        <h1 className="login-form">LOGIN</h1>
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
          <input type="submit" value="Login" />
        </form>
      </div>
    )
  }
}

export default LoginForm;

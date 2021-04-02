import React from 'react';
import PropTypes from 'prop-types';
import { apiCall, setTokenHeader } from '../services/api';
import jwt_decode from "jwt-decode";

class LoginForm extends React.Component {
  state = {
    username: '',
    password: ''
  };

  handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  handle_login = async (e) => {
    e.preventDefault();
    console.log("hello handle login")
    var reqBody= this.state
    var headers={
      'Content-Type': 'application/json'
    }
    var response=await apiCall("post","/authenticate/login/",reqBody,headers)
    localStorage.setItem('token', response.token);
    console.log(response.token);
    let decoded_token = jwt_decode(response.token); 
    this.setState({
      logged_in: true,
      displayed_form: '',
      username: decoded_token.username 
    });
    setTokenHeader(response.token)
    this.props.history.push('/upload')
  };

  render() {
    return (
      <form onSubmit={e => this.handle_login(e)}>
        <h4>Log In</h4>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          value={this.state.username}
          onChange={this.handle_change}
        />
        <br/>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.handle_change}
        />
        <br/>
        <input type="submit" />
      </form>
    );
  }
}

export default LoginForm;

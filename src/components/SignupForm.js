import React from 'react';
import PropTypes from 'prop-types';
import { apiCall, setTokenHeader } from '../services/api';

class SignupForm extends React.Component {
  state = {
    username: '',
    password: '',
    auth_per_upload:false,
    public_key: 'sgh5jhjs66'
  };

  handle_signup = async (e) => {
    e.preventDefault();
    var reqBody= this.state
    var headers={
      'Content-Type': 'application/json'
    }
    var response=await apiCall("post","/authenticate/signup/",reqBody,headers)
    localStorage.setItem('token', response.token);
    console.log(response.token);
    this.setState({
      logged_in: true,
      displayed_form: '',
      username: response.username
    });
    setTokenHeader(response.token)
    this.props.history.push('/upload')
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

  handle_checkbox = e => {
    this.setState({
      auth_per_upload: !this.state.auth_per_upload
    })
  }

  render() {
    return (
      <form onSubmit={e => this.handle_signup(e)}>
        <h4>Sign Up</h4>
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
        <label htmlFor="auth_per_upload">AuthPerUpload</label>
        <input
          type="checkbox"
          name="auth_per_upload"
          value={this.state.authPerUpload}
          onChange={this.handle_checkbox}
        />
        <br/>
        <input type="submit" />
      </form>
    );
  }
}

export default SignupForm;



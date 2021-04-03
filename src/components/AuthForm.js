import React from 'react';
import { apiCall, setTokenHeader } from '../services/api';
import jwt_decode from "jwt-decode";
import './auth.scss'

class AuthForm extends React.Component {
  state = {
    username: '',
    password: '',
    auth_per_upload:false,
    public_key: 'sgh5jhjs66',
    current: false
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

  handle_signup = async (e) => {
    e.preventDefault();
    console.log("reached handle signup")
    var reqBody= this.state
    var headers={
      'Content-Type': 'application/json'
    }
    var response=await apiCall("post","http://localhost:8000/authenticate/signup/",reqBody,headers)
    localStorage.setItem('token', response.token);
    console.log(response.token);
    this.setState({
      logged_in: true,
      displayed_form: '',
      username: response.username
    });
    setTokenHeader(response.token)
    this.props.history.push('/googleAuth')
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
      <>
      <section className={this.state.current?"sign-up":null} id="auth">

      <form id="sign-up" onSubmit={e => this.handle_signup(e)}>
        <h2>Sign Up</h2>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          value={this.state.username}
          onChange={this.handle_change}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.handle_change}
        />
        {/* <label htmlFor="auth_per_upload">AuthPerUpload</label>
        <input
          type="checkbox"
          name="auth_per_upload"
          value={this.state.authPerUpload}
          onChange={this.handle_checkbox}
        /> */}
        <button type="submit">Sign Up</button>
    <div class="toggle">
      Already have an account?
      <span onClick={()=>{this.setState({current:false})}}>Log in</span>
    </div>
      </form>

      <form id="login" onSubmit={e => this.handle_login(e)}>
        <h2>Log In</h2>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          value={this.state.username}
          onChange={this.handle_change}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.handle_change}
        />
        <button type="submit">Log In</button>
        <div class="toggle">
      Don't have an account?
      <span onClick={()=>{this.setState({current:true})}}>Sign up</span>
    </div>
      </form>

      <div id="slider">
    <div id="login-text">
      <h1>Chamber of Secrets</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
    
    <div id="sign-up-text">
      <h1>Chamber of Secrets</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>
  </div>
    </section>
    </>
    
    );
  }
}

export default AuthForm;

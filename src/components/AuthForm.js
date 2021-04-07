import React from 'react';
import { apiCall, setTokenHeader } from '../services/api';
import jwt_decode from "jwt-decode";
import './styles/auth.scss'

class AuthForm extends React.Component {
  state = {
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    auth_per_upload: false,
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

  disappearMsg = () => {
    setTimeout(() => {
      this.setState({ error: '' })
    }, 2000);
  }

  handle_checkbox = e => {
    this.setState({
      auth_per_upload: !this.state.auth_per_upload
    })
  }

  handle_signup = async (e) => {
    e.preventDefault();
    try {
      var reqBody = this.state
      var headers = {
        'Content-Type': 'application/json'
      }
      var response = await apiCall("post", "/authenticate/signup/", reqBody, headers)
      localStorage.setItem('token', response.token);
      this.setState({
        logged_in: true,
        displayed_form: '',
        username: response.username,
      });
      setTokenHeader(response.token)
      let privateKey = jwt_decode(response.private)
      this.props.history.push({
        pathname: '/privateKey',
        state: { privateKey }
      })
    } catch (e) {
      this.setState({
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        error: e.username
      })
      this.disappearMsg()
    }
  };

  handle_login = async (e) => {
    e.preventDefault();
    try {
      var reqBody = this.state
      var headers = {
        'Content-Type': 'application/json'
      }
      var response = await apiCall("post", "/authenticate/login/", reqBody, headers)
      localStorage.setItem('token', response.token);
      let decoded_token = jwt_decode(response.token);
      this.setState({
        logged_in: true,
        displayed_form: '',
        username: decoded_token.username
      });
      setTokenHeader(response.token)
      this.props.history.push('/upload')
    } catch (e) {
      this.setState({
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        error: e.non_field_errors
      })
      this.disappearMsg()
    }
  };

  render() {
    return (
      <>
        <section className={this.state.current ? "sign-up" : null} id="auth">

          <form id="sign-up" onSubmit={e => this.handle_signup(e)}>
            <h2>Sign Up</h2>
            <label htmlFor="firstname">First Name</label>
            <input
              type="text"
              name="firstname"
              value={this.state.firstname}
              onChange={this.handle_change}
            />
            <label htmlFor="lastname">Last Name</label>
            <input
              type="text"
              name="lastname"
              value={this.state.lastname}
              onChange={this.handle_change}
            />
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
            <button type="submit">Sign Up</button>
            {this.state.error ?
              <div class="alert alert-danger" role="alert">{this.state.error}</div>
              :
              null
            }
            <div className="toggle">
              Already have an account?
      <span onClick={() => { this.setState({ current: false }) }}>Log in</span>
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
            {this.state.error ?
              <div class="alert alert-danger" role="alert">{this.state.error}</div>
              :
              null
            }
            <div className="toggle">
              Don't have an account?
      <span onClick={() => { this.setState({ current: true }) }}>Sign up</span>
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

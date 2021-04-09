import React from 'react';
import { apiCall } from '../services/api';
import { Redirect } from 'react-router-dom'
import './styles/oauth.scss'
import Gicon from '../assets/ggicon.png'
import DropboxIcon from '../assets/dropbox_icon.png'
import Tick from '../assets/tick.png'

class GoogleAuthScreen extends React.Component {
  state = {
    googleAuth: false,
    dropboxAuth: false,
    googleCode: '',
    dropboxCode: '',
    googleError: '',
    dropboxError: ''
  }

  authGoogle = async () => {
    /**Makes api call to get GDrive auth url and redirects to url in new tab */
    var uri = await apiCall("get", '/authenticate/get-gauth-url/')
    const newWindow = window.open(uri, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  };

  disappearMsg = (service) => {
    /**Removes error message from screen after 4s */
    setTimeout(() => {
      if (service === "google") {
        this.setState({ googleError: '' })
      } else {
        this.setState({ dropboxError: '' })
      }
    }, 4000);
  }

  authDropbox = async () => {
    /**Makes api call to get Dropbox auth url and redirects to url in new tab */
    var uri = await apiCall("get", '/authenticate/get-dropbox-auth-url/')
    const newWindow = window.open(uri, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value })
  }

  submitGoogleCode = async (e) => {
    /**Makes api call to send GDrive authorization code */
    try {
      e.preventDefault()
      var data = { code: this.state.googleCode }
      var status = await apiCall("post", "/authenticate/set-auth-token/", data)
      if (status.message === "Drive authentication successful") {
        this.setState({
          googleAuth: true
        })
      }
    } catch (e) {
      this.setState({
        googleError: e.message
      })
      this.disappearMsg("google")
    }
  }

  submitDropboxCode = async (e) => {
    /**Makes api call to send Dropbox authorization code */
    try {
      e.preventDefault()
      var data = { code: this.state.dropboxCode }
      var status = await apiCall("post", "/authenticate/set-dropbox-auth-token/", data)
      if (status.message === "Dropbox authentication successful") {
        this.setState({
          dropboxAuth: true
        })
      }
    } catch (e) {
      this.setState({
        dropboxError: e.message
      })
      this.disappearMsg("dropbox")
    }
  }

  render() {
    return (
      <div className="screen-parent">
        {this.state.googleAuth && this.state.dropboxAuth ?
          <Redirect to="/upload"></Redirect>
          :
          <>
            <h3 className="heading">Authenticate your Accounts</h3>
            <div className="auth-div-parent">
              <div className="auth-div">
                <div onClick={this.authGoogle} className="img-n-text">
                  <img alt="Google Icon" src={Gicon} height="80px" with="80px" />
                  <h4>Authenticate with Google</h4>
                </div>
                {this.state.googleAuth ?
                  <div className="tick-img">
                    <img alt="Tick mark icon" src={Tick} height="80px" width="100px" />
                  </div>
                  :
                  <>
                    <form onSubmit={this.submitGoogleCode}>
                      <div className="code-container">
                        <input onChange={this.handleChange} name="googleCode" value={this.state.googleCode} type="text" placeholder="Auth Code" className="textbox code-textbox" />
                      </div>
                      <div>
                        <input type="submit" />
                        <br />
                        <br />
                        {this.state.googleError ?
                          <div class="alert alert-danger" role="alert">{this.state.googleError}</div>
                          :
                          null
                        }
                      </div>
                    </form>
                  </>
                }
              </div>
              <div className="auth-div">
                <div onClick={this.authDropbox} className="img-n-text">
                  <img alt="Dropbox Icon" src={DropboxIcon} height="80px" width="80px" />
                  <h4>Authenticate with Dropbox</h4>
                </div>
                {this.state.dropboxAuth ?
                  <div className="tick-img">
                    <img alt="Tick mark icon" src={Tick} height="80px" width="100px" />
                  </div>
                  :
                  <>
                    <form onSubmit={this.submitDropboxCode}>
                      <div className="code-container">
                        <input onChange={this.handleChange} name="dropboxCode" value={this.state.dropboxCode} type="text" placeholder="Auth Code" className="textbox code-textbox" />
                      </div>
                      <div>
                        <input type="submit" />
                        <br />
                        <br />
                        {this.state.dropboxError ?
                          <div class="alert alert-danger" role="alert">{this.state.dropboxError}</div>
                          :
                          null
                        }
                      </div>
                    </form>
                  </>
                }
              </div>
            </div>
          </>}
      </div>
    );
  }
}

export default GoogleAuthScreen;
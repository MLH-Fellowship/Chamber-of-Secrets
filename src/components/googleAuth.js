import React from 'react';
import { apiCall } from '../services/api';
import {Redirect} from 'react-router-dom'
import './oauth.css'
import Gicon from '../assets/ggicon.png'
import DropboxIcon from '../assets/dropbox_icon.png'
import Tick from '../assets/tick.png'

class GoogleAuthScreen extends React.Component {
  state={
    googleAuth:false,
    dropboxAuth:false,
    googleCode:'',
    dropboxCode:''
  }
  
  authGoogle = async () => {
    var uri=await apiCall("get",'/authenticate/get-gauth-url/')
    const newWindow = window.open(uri, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  };

  authDropbox = async () => {
    var uri=await apiCall("get",'/authenticate/get-dropbox-auth-url/')
    const newWindow = window.open(uri, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  };

  handleChange=(e)=>{
    this.setState({[e.target.name]:e.target.value})
  }

  submitGoogleCode=async(e)=>{
    e.preventDefault()
    var data={code:this.state.googleCode}
    var status=await apiCall("post","/authenticate/set-auth-token/",data)
    console.log(status)
    if(status=="Drive Authentication Successful"){
      this.setState({
        googleAuth:true
      })
    }
  }

  submitDropboxCode=async(e)=>{
    e.preventDefault()
    var data={code:this.state.dropboxCode}
    var status=await apiCall("post","/authenticate/set-dropbox-auth-token/",data)
    console.log(status)
    if(status=="Dropbox Authentication Successful"){
      this.setState({
        dropboxAuth:true
      })
    }
  }
  
  onChange=(e)=>{
    this.setState({[e.target.name]:e.target.value})
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
              <img src={Gicon} height="80px" with="80px"/>
              <h4>Authenticate with Google</h4>
            </div>
            {this.state.googleAuth ? 
            <div className="tick-img">
              <img src={Tick} height="80px" width="100px"/>
            </div>
            :
            <>
            <form onSubmit={this.submitGoogleCode}>
            <div className="code-container">
            <input onChange={this.handleChange} name="googleCode" value={this.state.googleCode} type="text" placeholder="Auth Code" className="textbox code-textbox" />
            </div>
            <div>
            <input type="submit"/>
            </div>
            </form>
            </>
            }
          </div>
          <div className="auth-div">
            <div onClick={this.authDropbox} className="img-n-text">
              <img src={DropboxIcon} height="80px" width="80px"/>
              <h4>Authenticate with Dropbox</h4>
            </div>
            {this.state.dropboxAuth ? 
            <div className="tick-img">
              <img src={Tick} height="80px" width="100px"/>
            </div>
            :
            <>
            <form onSubmit={this.submitDropboxCode}>
            <div className="code-container">
              <input onChange={this.handleChange} name="dropboxCode" value={this.state.dropboxCode} type="text" placeholder="Auth Code" className="textbox code-textbox" />
            </div>
            <div>
            <input type="submit"/>
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
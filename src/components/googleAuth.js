import React from 'react';
import { apiCall } from '../services/api';
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
        <div className="key-portion">
          <h3>Your Private Key</h3>
          <p>Save this private key, you will not be able to upload/download files if you lose it!</p>
          <div className="private-key-parent">
          <div class="input-group">
              <input value={"hello world"} type="password" placeholder="First Name" class="textbox" />
              <span class="input-group-addon">
                <i class="far fa-copy fa-2x"></i>
              </span>
              <span class="input-group-addon">
              <i class="fas fa-download fa-2x"></i>
              </span>
          </div>
          </div>
        </div>
        <div className="auth-div-parent">
          <div className="auth-div">
            <div className="img-n-text">
              <img src={Gicon} height="80px" with="80px"/>
              <h4>Authenticate with Google</h4>
            </div>
            {this.state.googleAuth ? 
            <div className="tick-img">
              <img src={Tick} height="80px" width="100px"/>
            </div>
            :
            <>
            <div class="code-container">
              <input value={"hello world"} type="text" placeholder="Auth Code" class="textbox code-textbox" />
            </div>
            <div>
            <input type="submit"/>
            </div>
            </>
            }
          </div>
          <div className="auth-div">
            <div className="img-n-text">
              <img src={DropboxIcon} height="80px" width="80px"/>
              <h4>Authenticate with Dropbox</h4>
            </div>
            {this.state.dropboxAuth ? 
            <div className="tick-img">
              <img src={Tick} height="80px" width="100px"/>
            </div>
            :
            <>
            <div class="code-container">
              <input value={"hello world"} type="text" placeholder="Auth Code" class="textbox code-textbox" />
            </div>
            <div>
            <input type="submit"/>
            </div>
            </>
            }
          </div>
        </div>
      </div>
        // <div>
        //   <button onClick={this.authGoogle}>Google Oauth</button>
        //   <button onClick={this.authDropbox}>Dropbox Oauth</button>
        //   {this.state.googleAuth && this.state.dropboxAuth ? 
        //     //  <p>google auth done</p>
        //     <Redirect to="/upload"></Redirect>
        //      :
        //      <>
        //      <form onSubmit={this.submitGoogleCode}>
        //       <input onChange={this.onChange} type="text" name="googleCode" />
        //       <input type="submit"/>
        //     </form>
        //      <form onSubmit={this.submitDropboxCode}>
        //      <input onChange={this.onChange} type="text" name="dropboxCode" />
        //      <input type="submit"/>
        //    </form>
        //    </>
        //   }
        // </div>
    );
  }
}

export default GoogleAuthScreen;
import React from 'react';
import {Redirect} from 'react-router-dom'
import { apiCall } from '../services/api';

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
        <div>
          <button onClick={this.authGoogle}>Google Oauth</button>
          <button onClick={this.authDropbox}>Dropbox Oauth</button>
          {this.state.googleAuth && this.state.dropboxAuth ? 
            //  <p>google auth done</p>
            <Redirect to="/upload"></Redirect>
             :
             <>
             <form onSubmit={this.submitGoogleCode}>
              <input onChange={this.onChange} type="text" name="googleCode" />
              <input type="submit"/>
            </form>
             <form onSubmit={this.submitDropboxCode}>
             <input onChange={this.onChange} type="text" name="dropboxCode" />
             <input type="submit"/>
           </form>
           </>
          }
        </div>
    );
  }
}

export default GoogleAuthScreen;
import React from 'react';
import {Redirect} from 'react-router-dom'
import { apiCall } from '../services/api';

class GoogleAuthScreen extends React.Component {
  state={
    googleAuth:false,
    googleCode:''
  }
  
  authGoogle = async () => {
    var uri=await apiCall("get",'/authenticate/get-gauth-url/')
    console.log(this.props)
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
  
  onChange=(e)=>{
    this.setState({[e.target.name]:e.target.value})
  }

  render() {
    return (
        <div>
          <button onClick={this.authGoogle}>Google Oauth</button>
          {this.state.googleAuth ? 
            //  <p>google auth done</p>
            <Redirect to="/upload"></Redirect>
             :
             <form onSubmit={this.submitGoogleCode}>
              <input onChange={this.onChange} type="text" name="googleCode" />
              <input type="submit"/>
            </form>
          }
        </div>
    );
  }
}

export default GoogleAuthScreen;
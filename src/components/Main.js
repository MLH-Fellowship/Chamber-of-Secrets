import React, { Component } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import {Switch,Route,withRouter,Redirect} from "react-router-dom"
import Upload from './Upload';
import Nav from './Nav'
import GoogleAuthScreen from './googleAuth'
import { setTokenHeader } from '../services/api';

const Main= (props)=>{
    var isLoggedIn=localStorage.getItem("token")
    if(isLoggedIn){
        setTokenHeader(isLoggedIn)
    }
    return(
    <div>
        <Switch>
            <Route exact path="/" render={props => isLoggedIn ? <Upload {...props}/> : <LoginForm {...props}/>}></Route>
            <Route exact path="/signup" render={props => <SignupForm {...props}/>}></Route>
            <Route exact path="/upload" render={props => <Upload {...props}/>}></Route>
            <Route exact path="/googleAuth" render={props => <GoogleAuthScreen {...props}/>}></Route>
        </Switch>
    </div>
    )
}
export default withRouter(Main);
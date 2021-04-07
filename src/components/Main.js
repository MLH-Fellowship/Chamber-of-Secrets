import React, { Component } from 'react';
import AuthForm from './AuthForm';
import {Switch,Route,withRouter,Redirect} from "react-router-dom"
import Upload from './Upload';
import Nav from './Nav'
import GoogleAuthScreen from './Oauth'
import { setTokenHeader } from '../services/api';
import PrivateKeyScreen from './PvtKey'

const Main= (props)=>{
    var isLoggedIn=localStorage.getItem("token")
    if(isLoggedIn){
        setTokenHeader(isLoggedIn)
    }
    return(
    <div>
        <Switch>
            <Route exact path="/" render={props => isLoggedIn ? <Upload {...props}/> : <AuthForm {...props}/>}></Route>
            <Route exact path="/upload" render={props => <Upload {...props}/>}></Route>
            <Route exact path="/OAuth" render={props => <GoogleAuthScreen {...props}/>}></Route>
            <Route exact path="/privateKey" render={props => <PrivateKeyScreen {...props}/>}></Route>
        </Switch>
    </div>
    )
}
export default withRouter(Main);
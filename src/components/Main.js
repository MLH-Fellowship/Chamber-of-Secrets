import React, { Component } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import {Switch,Route,withRouter,Redirect} from "react-router-dom"
import Upload from './Upload';

const Main= props=>{
    return(
    <div>
        <Switch>
        <Route exact path="/" render={props => <SignupForm {...props}/>}></Route>
        <Route exact path="/signin" render={props => <LoginForm {...props}/>}></Route>
        <Route exact path="/upload" render={props => <Upload {...props}/>}></Route>
        </Switch>
    </div>
    )
}
export default withRouter(Main);
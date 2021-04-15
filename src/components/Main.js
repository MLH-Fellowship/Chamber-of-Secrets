import React from 'react';
import AuthForm from './AuthForm';
import { Switch, Route, withRouter ,Redirect} from "react-router-dom"
import Upload from './Upload';
import GoogleAuthScreen from './Oauth'
import { setTokenHeader } from '../services/api';
import PrivateKeyScreen from './PvtKey'

const Main = (props) => {
    var isLoggedIn = localStorage.getItem("token")
    if (isLoggedIn) {
        setTokenHeader(isLoggedIn)
    }
    return (
        <div>
            <Switch>
            <Route exact path="/" render={props => isLoggedIn ? <Upload {...props} /> : <AuthForm {...props}/>}></Route>
            <Route exact path="/upload" render={props => isLoggedIn ? <Upload {...props} /> : <Redirect to="/"/> }></Route>
            <Route exact path="/OAuth" render={props => isLoggedIn? <GoogleAuthScreen {...props}/>  : <Redirect to="/"/>}></Route>
            <Route exact path="/privateKey" render={props => isLoggedIn? <PrivateKeyScreen {...props} />  : <Redirect to="/"/>}></Route>
            </Switch>
        </div>
    )
}
export default withRouter(Main);
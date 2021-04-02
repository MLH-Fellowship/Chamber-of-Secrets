import React from 'react';
import {BrowserRouter as Router} from "react-router-dom"
import Main from "./Main"

function App() {
  var isLoggedIn=localStorage.getItem("token")
  return(
      <Router>
        <div className="appcomp">
            <Main isLoggedIn={isLoggedIn}/>
        </div>
      </Router>
  )
}
  

export default App
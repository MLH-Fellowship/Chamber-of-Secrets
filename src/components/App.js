import React from 'react';
import {BrowserRouter as Router} from "react-router-dom"
import Main from "./Main"
import Nav from './Nav'

function App() {

  return(
      <Router>
      <div className="appcomp">
        <Nav />
        <Main/>
      </div>
      </Router>
  )
}


  

export default App
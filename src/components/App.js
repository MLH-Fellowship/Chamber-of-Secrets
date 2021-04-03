import React from 'react';
import {BrowserRouter as Router} from "react-router-dom"
import Main from "./Main"

function App() {
  return(
      <Router>
        <div className="appcomp">
            <Main/>
        </div>
      </Router>
  )
}
  

export default App
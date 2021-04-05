import React from 'react';
import {withRouter, useHistory} from 'react-router-dom'
import './key.css'

const PrivateKeyScreen= (props)=>{
    let history=useHistory()
    let pvtKey=props.location.state.privateKey.private
    console.log("pvt",pvtKey)
    
    const moveToOauth=()=>{
      history.push('/OAuth')
    }

    const copyPrivateKey=()=>{
      var tempInput = document.createElement("input");
      tempInput.value = pvtKey;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      var copyText = document.getElementById("pvt-key-code");
      copyText.select();
      
    }

    const downloadPrivateKey=()=>{
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pvtKey));
      element.setAttribute('download', "key.txt");

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }

    return(
    <div className="key-parent">
          <div>
            <h3 className="key-heading">Your Private Key</h3>
            <p className="subheading">Save this private key, you will not be able to upload/download files if you lose it!</p>
          </div>
          <div className="private-key-parent">
            <div className="input-group">
                <input id="pvt-key-code" style={{fontSize:"50px"}} value={pvtKey} type="password" placeholder="First Name" className="textbox" />
                <span onClick={copyPrivateKey} className="clickable input-group-addon">
                  <i className="far fa-copy fa-2x"></i>
                </span>
                <span onClick={downloadPrivateKey} className="input-group-addon clickable">
                <i className="fas fa-download fa-2x"></i>
                </span>
            </div>
            <br/>
            <button onClick={moveToOauth}>Next</button>
        </div> 
    </div>
    )
}
export default withRouter(PrivateKeyScreen);
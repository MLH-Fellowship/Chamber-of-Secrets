import React from 'react';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver'
import { apiCall, fileUploadApiCall } from '../services/api';

class Upload extends React.Component {
  state = {
    file:null,
    private_key:'',
    //for download stuff
    download_file_name:'',
    d_private_key:''
  };

  handleImageUpload = (e) => {
    this.setState({file:e.target.files[0]})
  }

  handleDownloadSubmit =async (e) =>{
    e.preventDefault();
    // var reqBody={
    //   file_name: this.state.download_file_name,
    //   private_key: this.state.d_private_key
    // }
    // var headers={
    //   'content-type': 'application/json'
    // }
    // var blob=await apiCall("post","/horcrux/download/",reqBody,headers)
    // //var tosave=blob.blob()
    // console.log("blb",blob)
    //saveAs(blob, 'file.pdf')
    fetch('/horcrux/download/',{
      method:"POST",
      headers:{
        'content-type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem("token")}`
      },
      body:JSON.stringify({
        file_name: this.state.download_file_name,
        private_key: this.state.d_private_key
      })
    }).then(res => {
      return res.blob()
    }).then(blob => 
      saveAs(blob, 'file.pdf')
    )
    .catch(err => console.log(err))
  }

  getUserFiles=async(e)=>{
    var files=await apiCall("get","/horcrux/get-files/")
    console.log(files)

  }

  handleSubmit = async (e) => {
    e.preventDefault();
    console.log(this.state);
    let form_data = new FormData();
    form_data.append('file_uploaded', this.state.file, this.state.file.name);
    form_data.append('private_key', this.state.private_key);
    let url = '/horcrux/upload/';
    var res=await fileUploadApiCall(url,form_data)
    console.log(res)
  };

  handleChange=e=>{
    this.setState({[e.target.name]:e.target.value})
    console.log(this.state)
  }


  render() {
    return (
      <>
      <form onSubmit={this.handleSubmit}>
        <h4>Upload file</h4>
        <input type="file" id="fileUpload" onChange={this.handleImageUpload}/>
        <br/>
        <input type="password" id="privateKey" name="private_key" onChange={this.handleChange}/>
        <br/>
        <input type="submit" />
      </form>
      <br/>
      <p>download stuff</p>
      <form onSubmit={this.handleDownloadSubmit}>
        <h4>Download file</h4>
        <input type="text" name="download_file_name" id="filename" placeholder="file name" onChange={this.handleChange}/>
        <br/>
        <input type="password" id="privateKey" name="d_private_key" onChange={this.handleChange}/>
        <br/>
        <input type="submit" />
      </form>
      <button onClick={this.getUserFiles} value="get user files">hello</button>
    </>
    );
  }
}

export default Upload;


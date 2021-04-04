import React from 'react';
import { saveAs } from 'file-saver'
import Nav from './Nav'
import { apiCall, fileUploadApiCall } from '../services/api';
import './upload.css'
import './sidebar.css'
import Modal from './Modal'

class Upload extends React.Component {
  state = {
    file:null,
    private_key:'',
    //for download stuff
    download_file_name:'',
    d_private_key:'',
    files:[{name:'file1.txt'},{name:'file2.txt'},{name:'file3.txt'}],
    modal_open:false
  };

  handleImageUpload = (e) => {
    this.setState({file:e.target.files[0]})
  }

  handleDownloadSubmit =async (e,code) =>{
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
        private_key: code
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

  toggle = () => {
    const currState = this.state.modal_open
    this.setState({modal_open: !currState})
  }


  render() {

    const fs = this.state.files.map((file)=>(
      <React.Fragment>
        <div id={file.name} 
        class="icon textedit" 
        onDoubleClick={()=>{
          console.log("add six")
          document.getElementById('modal-container').classList.add('six')
          document.getElementById('modal-container').classList.remove('out')
          console.log(document.getElementById('modal-container').classList)
        }} 
        onClick={()=>{document.getElementById(file.name).classList.toggle('highlighted')}}>
          {file.name}
        </div>
      </React.Fragment>
    ))

    return (
      <>
       {/* <Nav isLoggedIn={true}/> */}

       <div id="viewport">

  <div id="sidebar">
    <header>
      <a href="#">My App</a>
    </header>
    <ul class="nav">
      <li>
        <a href="#">
          <i class="zmdi zmdi-view-dashboard"></i> Dashboard
        </a>
      </li>
      <li>
        <a href="#">
          <i class="zmdi zmdi-link"></i> Shortcuts
        </a>
      </li>
      <li>
        <a href="#">
          <i class="zmdi zmdi-widgets"></i> Overview
        </a>
      </li>
      <li>
        <a href="#">
          <i class="zmdi zmdi-calendar"></i> Events
        </a>
      </li>
      <li>
        <a href="#">
          <i class="zmdi zmdi-info-outline"></i> About
        </a>
      </li>
      <li>
        <a href="#">
          <i class="zmdi zmdi-settings"></i> Services
        </a>
      </li>
      <li>
        <a href="#">
          <i class="zmdi zmdi-comment-more"></i> Contact
        </a>
      </li>
    </ul>
  </div>

  <div id="content">
    {/* <nav class="navbar navbar-default">
      <div class="container-fluid">
        <ul class="nav navbar-nav navbar-right">
          <li>
            <a href="#"><i class="zmdi zmdi-notifications text-danger"></i>
            </a>
          </li>
          <li><a href="#">Test User</a></li>
        </ul>
      </div>
    </nav> */}
    <div class="container-fluid">
    <div id="desktop">
        {fs}
    </div>
    </div>
  </div>
</div>

        <Modal onClose={()=>{
          console.log("okok")
          document.getElementById('modal-container').classList.add('out')
          console.log(document.getElementById('modal-container').classList)
          //document.getElementById('modal-container').classList.remove('six')
          }} download={this.handleDownloadSubmit}></Modal>

      {/* <form onSubmit={this.handleSubmit}>
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
      <button onClick={this.getUserFiles} value="get user files">hello</button> */}
    </>
    );
  }
}

export default Upload;


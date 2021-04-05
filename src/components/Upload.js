import React from 'react';
import { saveAs } from 'file-saver'
import Nav from './Nav'
import { apiCall, fileUploadApiCall } from '../services/api';
import './upload.css'
import './sidebar.css'
import Modal from './Modal'
import jwtDecode from 'jwt-decode';
import Profile from '../assets/profile.jpg'
import { setTokenHeader } from '../services/api';

class Upload extends React.Component {
  state = {
    file:null,
    private_key:'',
    selectedFileName:'',
    //for download stuff
    download_file_name:'',
    d_private_key:'',
    files:[],
    is_modal_download:true,
  };

  componentDidMount(){
    this.getUserFiles()
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
        file_name: this.state.selectedFileName,
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
    this.setState({files})
  }

  handleUploadSubmit = async (e,code,file) => {
    e.preventDefault();
    console.log(code);
    console.log(file)
    let form_data = new FormData();
    form_data.append('file_uploaded', file, file.name);
    form_data.append('private_key', code);
    let url = '/horcrux/upload/';
    var res=await fileUploadApiCall(url,form_data)
    console.log(res)
  };

  handleChange=e=>{
    this.setState({[e.target.name]:e.target.value})
    console.log(this.state)
  }

  logout=async ()=>{
    await localStorage.removeItem("token")
    await setTokenHeader(false)
    this.props.history.push('/')
  }

  getUsername = () =>{
    const auth_token=localStorage.getItem("token")
    if(auth_token){
      var user=jwtDecode(auth_token)
      return user.username
    }else{
      return "Stranger"
    }
  }


  render() {

    const fs = this.state.files.map((file,index)=>(
      <React.Fragment key={index}>
        <div id={file.file_name} 
        className="icon textedit" 
        onDoubleClick={()=>{
          this.setState({selectedFileName:file.name, is_modal_download:true})
          console.log("add six")
          document.getElementById('modal-container').classList.add('six')
          document.getElementById('modal-container').classList.remove('out')
          console.log(document.getElementById('modal-container').classList)
        }} 
        onClick={()=>{document.getElementById(file.name).classList.toggle('highlighted')}}>
          {file.file_name}
        </div>
      </React.Fragment>
    ))

    return (
      <>
       {/* <Nav isLoggedIn={true}/> */}

       <div id="viewport">

  <div id="sidebar">
    <ul className="nav">
      <li>
        <img src={Profile} height="80px" width="80px" style={{borderRadius:"50%"}}/>
        <br/><br/>
        <h4 style={{color:"white"}}>Hi <br/>{this.getUsername()}</h4>
      </li>
      <li>
        <a onClick={()=>{
          this.setState({is_modal_download:false})
          console.log("add six")
          document.getElementById('modal-container').classList.add('six')
          document.getElementById('modal-container').classList.remove('out')
          console.log(document.getElementById('modal-container').classList)
        }}>
          <i className="zmdi zmdi-link"></i> New File
        </a>
      </li>
      <li>
        <a onClick={this.logout}>
          <i className="zmdi zmdi-comment-more"></i> Logout
        </a>
      </li>
    </ul>
  </div>

  <div id="content">
    <div className="container-fluid">
    <div id="desktop">
        {fs}
    </div>
    </div>
  </div>
</div>

        <Modal 
          onClose={()=>{
          console.log("okok")
          document.getElementById('modal-container').classList.add('out')
          console.log(document.getElementById('modal-container').classList)
          }} 
          download={this.handleDownloadSubmit} 
          filename={this.state.selectedFileName} 
          is_download={this.state.is_modal_download}
          upload={this.handleUploadSubmit}
          ></Modal>

      {/* <form onSubmit={this.handleUploadSubmit}>
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


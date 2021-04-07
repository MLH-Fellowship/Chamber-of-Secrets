import React from 'react';
import { saveAs } from 'file-saver'
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
    loadingState:false,
    error:'',
    highlightedFile:'',
    is_delete:false
  };

  componentWillMount(){
    document.addEventListener("keydown",this._handleDeleteKey, false)
    document.addEventListener("mousedown",this._handleClick, false)
  }

  componentWillUnmount(){
    document.removeEventListener("mousedown",this._handleClick, false)
  }

  componentDidMount(){
    this.getUserFiles()
  }

  _handleClick = (e) => {
    console.log(e);
    if(e.target.classList.contains("icon"))
      return;

    this.clearHighlights()
  }

  clearHighlights = () => {
    var files = document.getElementsByClassName("icon")
    for(let i=0; i<files.length;i++)
    {
      if(files[i].classList.contains("highlighted"))
      {
        files[i].classList.remove("highlighted")
      }
    }
    this.setState({highlightedFile:''})
  }

_handleDeleteKey = async (e)=>{
  if(e.keyCode == 46){
    console.log("Deleting ", this.state.highlightedFile)
    this.setState({is_delete:true})
    document.getElementById('modal-container').classList.add('six')
    document.getElementById('modal-container').classList.remove('out')
    if(this.state.highlightedFile){
      await this.handleDelete(this.state.highlightedFile)
      this.setState({highlightedFile:''})
      document.getElementById('modal-container').classList.add('out')
      this.setState({is_delete:false})
      this.clearHighlights()
    }
  }
}



  handleDelete = async (filename)=>{
    try{
      var reqBody={file_name:filename}
      var headers={"content-type":"application/json"}
      console.log("coming inside handledelete")
      var res=await apiCall("post","/horcrux/delete/",reqBody, headers)
      if(res.message=="File deleted successfully"){
        this.getUserFiles()
      } 
    }catch(e){
      console.log("err",e)
      alert("some error, not deleted")
    }
  }

  disappearMsg=()=>{
    setTimeout(() => {
      this.setState({error:''})
    }, 5000);
  }

  handleDownloadSubmit =async (e,code) =>{
    e.preventDefault();
    this.setState({loadingState:true})
    fetch(`/horcrux/download/`,{
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
      console.log("bob res is",res.status)
      if(res.status!=200){
        throw Error("Private key is incorrect or something")
      }
      return res.blob()
    }).then(blob => {
      console.log("blob is what", blob)
      saveAs(blob, this.state.selectedFileName)
      this.setState({loadingState:false})
      document.getElementById('modal-container').classList.add('out')
    }
    )
    .catch(err => {
      console.log("err is",err)
      this.setState({error:err.message, loadingState:false})
      this.disappearMsg()
    })
  }

  getUserFiles=async(e)=>{
    var files=await apiCall("get","/horcrux/get-files/")
    this.setState({files})
  }

  handleUploadSubmit = async (e,code,file) => {
    e.preventDefault();
    this.setState({loadingState:true})
    try{
      console.log(code);
      console.log("file is ",file)
      if(file){
        let form_data = new FormData();
        form_data.append('file_uploaded', file, file.name);
        form_data.append('private_key', code);
        let url = '/horcrux/upload/';
        var res=await fileUploadApiCall(url,form_data)
        console.log("res is",res)
        document.getElementById('modal-container').classList.add('out')
        console.log(document.getElementById('modal-container').classList)
        this.getUserFiles()
        this.setState({loadingState:false,selectedFileName:''})
      }else{
        this.setState({error:"No file choosen", loadingState:false })
        this.disappearMsg()
      }
      
    }catch(e){
      // console.log("unsuccessful",e.response.data)
      this.setState({error:e.response.data.message, loadingState:false})
      this.disappearMsg()
    }
    
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

  getExtensionClass = (filename) =>{
    let className = "icon "
    if(filename.endsWith(".pdf")){
      className = className + "pdf"
    }
    else if(filename.endsWith(".csv")){
      className = className + "csv"
    }
    else if(filename.endsWith(".docx") || filename.endsWith(".doc")){
      className = className + "docx"
    }
    else if(filename.endsWith(".ppt") || filename.endsWith(".pptx")){
      className = className + "ppt"
    }
    else if(filename.endsWith(".png") || filename.endsWith(".jpg") || filename.endsWith(".jpeg")){
      className = className + "img"
    }
    else if(filename.endsWith(".xlsx")){
      className = className + "xlsx"
    }
    else if(filename.endsWith(".mp4")){
      className = className + "vid"
    }
    else if(filename.endsWith(".mp3")){
      className = className + "mus"
    }
    else{
      className = className + "textedit"
    }

    return className
  }


  render() {

    const fs = this.state.files.map((file,index)=>(  
      <React.Fragment key={index}>
        <div id={file.file_name} 
        className={this.getExtensionClass(file.file_name)} 
        // onKeyPress={(key)=>{
        //   if(key.code==46){
        //     console.log("delete key pressed")
        //     this.handleDelete(file.file_name)
        //   }
        // }}
        onDoubleClick={()=>{
          this.setState({selectedFileName:file.file_name, is_modal_download:true})
          console.log("add six")
          document.getElementById('modal-container').classList.add('six')
          document.getElementById('modal-container').classList.remove('out')
        }}
        onClick={()=>{
          if(this.state.highlightedFile=='')
          {
            document.getElementById(file.file_name).classList.add('highlighted');
            this.setState({highlightedFile:file.file_name})
          }
          else if(this.state.highlightedFile==file.file_name)
          {
            document.getElementById(file.file_name).classList.remove('highlighted');
            this.setState({highlightedFile:""})
          }
          else
          {
            this.clearHighlights();
            document.getElementById(file.file_name).classList.add('highlighted');
            this.setState({highlightedFile:file.file_name})
          }
        }
        }>
          <p style={{color:"white"}}>{file.file_name}</p>
          {/* <p onClick={()=>this.handleDelete(file.file_name)}>delete</p> */}
        </div>
      </React.Fragment>
    ))

    return (
      <>
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
        {fs && fs.length>0 ? fs : <div style={{padding:"50px",color:"white"}}>No files uploaded yet</div>}
    </div>
    </div>
  </div>
</div>

        <Modal 
          loadingState={this.state.loadingState}
          error={this.state.error}
          onClose={()=>{
          console.log("okok")
          document.getElementById('modal-container').classList.add('out')
          console.log(document.getElementById('modal-container').classList)
          }} 
          download={this.handleDownloadSubmit} 
          filename={this.state.selectedFileName} 
          is_download={this.state.is_modal_download}
          upload={this.handleUploadSubmit}
          is_delete={this.state.is_delete}
          ></Modal>
    </>
    );
  }
}

export default Upload;


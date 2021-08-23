import React from 'react';
import { saveAs } from 'file-saver'
import { apiCall, fileUploadApiCall } from '../services/api';
import './styles/upload.css'
import './styles/sidebar.css'
import Modal from './Modal'
import jwtDecode from 'jwt-decode';
import Profile1 from '../assets/profile/profile1.jpg';
import Profile2 from '../assets/profile/profile2.jpg'
import Profile3 from '../assets/profile/profile3.jpg'
import Profile4 from '../assets/profile/profile4.jpg'
import Profile5 from '../assets/profile/profile5.jpg'
import Profile6 from '../assets/profile/profile6.png'
import { setTokenHeader } from '../services/api';
import { serverUrl } from '../services/config'

const Profile = [Profile1, Profile2, Profile3, Profile4, Profile5, Profile6];

class Upload extends React.Component {
  state = {
    file: null,
    private_key: '',
    selectedFileName: '',
    download_file_name: '',
    d_private_key: '',
    files: [],
    is_modal_download: true,
    loadingState: false,
    error: '',
    highlightedFile: '',
    is_delete: false
  };

  componentWillUnmount() {
    document.removeEventListener("mousedown", this._handleClick, false)
  }

  componentDidMount() {
    document.addEventListener("keydown", this._handleDeleteKey, false)
    document.addEventListener("mousedown", this._handleClick, false)
    this.getUserFiles()
  }

  _handleClick = (e) => {
    /**
     * Handles when mouse button is clicked anywhere on screen
     * If icon is not clicked i.e rest of desktop is clicked, file highlights are removed
     */
    if (e.target.classList.contains("icon"))
      return;

    this.clearHighlights()
  }

  clearHighlights = () => {
    /**Removes highlight effect from file icon */
    var files = document.getElementsByClassName("icon")
    for (let i = 0; i < files.length; i++) {
      if (files[i].classList.contains("highlighted")) {
        files[i].classList.remove("highlighted")
      }
    }
    this.setState({ highlightedFile: '' })
  }

  _handleDeleteKey = async (e) => {
    /**Calls delete loading animation modal and calls delete file function */
    if (e.keyCode === 46) {
      this.setState({ is_delete: true })
      document.getElementById('modal-container').classList.add('six')
      document.getElementById('modal-container').classList.remove('out')
      if (this.state.highlightedFile) {
        await this.handleDelete(this.state.highlightedFile)
        this.setState({ highlightedFile: '' })
        document.getElementById('modal-container').classList.add('out')
        this.setState({ is_delete: false })
        this.clearHighlights()
      }
    }
  }

  handleDelete = async (filename) => {
    /**Makes API call to delete file */
    try {
      var reqBody = { file_name: filename }
      var headers = { "content-type": "application/json" }
      var res = await apiCall("post", "/horcrux/delete/", reqBody, headers)
      if (res.message === "File deleted successfully") {
        this.getUserFiles()
      }
    } catch (e) {
      if (e.response.data.message) {
        alert(e.response.data.message)
      } else {
        alert("An unexpected error occured")
      }
    }
  }

  disappearMsg = () => {
    /**Removes error message from screen after 5 secs */
    setTimeout(() => {
      this.setState({ error: '' })
    }, 5000);
  }

  handleDownloadSubmit = async (e, code) => {
    /**Makes API Call to download a file */
    e.preventDefault();
    this.setState({ loadingState: true })
    fetch(`${serverUrl}/horcrux/download/`, {
      method: "POST",
      headers: {
        'content-type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        file_name: this.state.selectedFileName,
        private_key: code
      })
    }).then(async (res) => {
      if (res.status !== 200) {
        var error = await res.json()
        throw Error(error.message)
      }
      return res.blob()
    }).then(blob => {
      saveAs(blob, this.state.selectedFileName)
      this.setState({ loadingState: false })
      document.getElementById('modal-container').classList.add('out')
    }
    )
      .catch(err => {
        this.setState({ error: err.message, loadingState: false })
        this.disappearMsg()
      })
  }

  getUserFiles = async (e) => {
    /**Makes API Call to get current user files */
    var files = await apiCall("get", "/horcrux/get-files/")
    this.setState({ files })
  }

  handleUploadSubmit = async (e, code, file) => {
    /**Makes API Call to upload a file */
    e.preventDefault();
    this.setState({ loadingState: true })
    try {
      if (file) {
        let form_data = new FormData();
        form_data.append('file_uploaded', file, file.name);
        form_data.append('private_key', code);
        let url = '/horcrux/upload/';
        await fileUploadApiCall(url, form_data)
        document.getElementById('modal-container').classList.add('out')
        this.getUserFiles()
        this.setState({ loadingState: false, selectedFileName: '' })
      } else {
        this.setState({ error: "No file choosen", loadingState: false })
        this.disappearMsg()
      }

    } catch (e) {
      this.setState({ error: e.response.data.message, loadingState: false })
      this.disappearMsg()
    }

  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  logout = async () => {
    await localStorage.removeItem("token")
    await setTokenHeader(false)
    this.props.history.push('/') /*redirects to auth screen*/
  }

  getUsername = () => {
    const auth_token = localStorage.getItem("token")
    if (auth_token) {
      var user = jwtDecode(auth_token)
      return user.username
    } else {
      return "Stranger"
    }
  }

  getExtensionClass = (filename) => {
    /**Sets different icons for different file extensions */
    let className = "icon "
    if (filename.endsWith(".pdf")) {
      className = className + "pdf"
    }
    else if (filename.endsWith(".csv")) {
      className = className + "csv"
    }
    else if (filename.endsWith(".docx") || filename.endsWith(".doc")) {
      className = className + "docx"
    }
    else if (filename.endsWith(".ppt") || filename.endsWith(".pptx")) {
      className = className + "ppt"
    }
    else if (filename.endsWith(".png") || filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
      className = className + "img"
    }
    else if (filename.endsWith(".xlsx")) {
      className = className + "xlsx"
    }
    else if (filename.endsWith(".mp4")) {
      className = className + "vid"
    }
    else if (filename.endsWith(".mp3")) {
      className = className + "mus"
    }
    else {
      className = className + "textedit"
    }

    return className
  }

  render() {

    const fs = this.state.files.map((file, index) => (
      <React.Fragment key={index}>
        <div id={file.file_name}
          className={this.getExtensionClass(file.file_name)}
          onDoubleClick={() => {
            this.setState({ selectedFileName: file.file_name, is_modal_download: true })
            document.getElementById('modal-container').classList.add('six')
            document.getElementById('modal-container').classList.remove('out')
          }}
          onClick={() => {
            if (this.state.highlightedFile === '') {
              document.getElementById(file.file_name).classList.add('highlighted');
              this.setState({ highlightedFile: file.file_name })
            }
            else if (this.state.highlightedFile === file.file_name) {
              document.getElementById(file.file_name).classList.remove('highlighted');
              this.setState({ highlightedFile: "" })
            }
            else {
              this.clearHighlights();
              document.getElementById(file.file_name).classList.add('highlighted');
              this.setState({ highlightedFile: file.file_name })
            }
          }
          }>
          <p style={{ color: "white" }}>{file.file_name}</p>
        </div>
      </React.Fragment>
    ))

    return (
      <>
        <div id="viewport">

          <div id="sidebar">
            <ul className="nav">
              <li>
                <img alt="Voldemort" src={Profile[parseInt(Math.random()*6)]} height="80px" width="80px" style={{ borderRadius: "50%" }} />
                <br /><br />
                <h4 style={{ color: "white" }}>Hi <br />{this.getUsername()}</h4>
              </li>
              <li>
                <a onClick={() => {
                  this.setState({ is_modal_download: false })
                  document.getElementById('modal-container').classList.add('six')
                  document.getElementById('modal-container').classList.remove('out')
                }}>
                  <i class="fas fa-file-alt"></i> New File
        </a>
              </li>
              <li>
                <a onClick={this.logout}>
                  <i class="fas fa-sign-out-alt"></i> Logout
        </a>
              </li>
            </ul>
          </div>

          <div id="content">
            <div className="container-fluid">
              <div id="desktop">
                {fs && fs.length > 0 ? fs : <div style={{ padding: "50px", color: "white" }}>No files uploaded yet</div>}
              </div>
            </div>
          </div>
        </div>

        <Modal
          loadingState={this.state.loadingState}
          error={this.state.error}
          onClose={() => {
            document.getElementById('modal-container').classList.add('out')
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


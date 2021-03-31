import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'

class Upload extends React.Component {
  state = {
    file:null,
    private_key:''
  };

  handleImageUpload = (e) => {
    this.setState({file:e.target.files[0]})
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    let form_data = new FormData();
    form_data.append('file_uploaded', this.state.file, this.state.file.name);
    form_data.append('private_key', this.state.private_key);
    let url = '/horcrux/upload/';
    axios.post(url, form_data, {
      headers: {
        'content-type': 'multipart/form-data',
        'Authorization':this.props.authToken
      }
    })
        .then(res => {
          console.log(res.data);
        })
        .catch(err => console.log(err))
  };

  handleChange=e=>{
    this.setState({[e.target.name]:e.target.value})
    console.log(this.state)
  }


  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h4>Upload file</h4>
        <input type="file" id="fileUpload" onChange={this.handleImageUpload}/>
        <br/>
        <input type="password" id="privateKey" name="private_key" onChange={this.handleChange}/>
        <br/>
        <input type="submit" />
      </form>
    );
  }
}

export default Upload;


import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios'

class Upload extends React.Component {
  state = {
    file:null
  };

  handleImageUpload = (e) => {
    this.setState({file:e.target.files[0]})
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
    let form_data = new FormData();
    form_data.append('file_uploaded', this.state.file, this.state.file.name);
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

//   handleSubmit = e =>{
//     e.preventDefault()
//     const data=new FormData()
//     data.append("file_uploaded",this.state.file)
//     console.log(data)
//     // axios.post('http://127.0.0.1:8000/uploadFiles/', {
//     //     formData,
//     //     name: 'name',
//     //     headers: {
//     //         Accept: 'application/json, text/plain, */*',
//     //         'Content-Type': 'multipart/form-data'
//     //     },
//     // })
//     //     .then(() => {
//     //         console.log('All Done',);
//     //     })
//     //     .catch(error => {
//     //         console.log('error.response: ', error.response);
//     //     });
//     fetch('/horcrux/upload/', {
//         method: 'POST',
//         body: data,
//         headers:{
//             'Authorization':this.props.authToken,
//             'Content-Type': 'multipart/form-data'
//         }
//       })
//       .then(response => response.json())
//       .then(data => {
//         console.log(data)
//       })
//       .catch(error => {
//         console.error(error)
//     })
//   }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h4>Upload file</h4>
        <input type="file" id="fileUpload" onChange={this.handleImageUpload}/>
        <br/>
        <input type="submit" />
      </form>
    );
  }
}

export default Upload;


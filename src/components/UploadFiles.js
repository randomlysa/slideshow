import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import $ from 'jquery';

class UploadFiles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      folders: [],
      activeFolder: '',
      disabled: true
    }
  }

  setActiveFolder(e) {
    if (e.target.value) {
      this.setState({
        disabled: false,
        activeFolder: e.target.value
      });
    } else {
      this.setState({
        disabled: true,
        activeFolder: ''
      });
    }
  }

  onDrop(acceptedFiles) {
    acceptedFiles.forEach(file => {
      // formData: https://stackoverflow.com/a/24939229/3996097
      var formData = new FormData();
      formData.append('photo', file);
      // Set folder to upload file to.
      formData.append('folder', this.state.activeFolder);

      // http://localhost/slideshow/public/php/uploadFiles.php
      $.ajax({
        url: 'http://localhost/slideshow/public/php/uploadFiles.php',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false
      })
      .done((data) => {
        console.log(data);
      })
      .fail((e) => {
        console.log(e);
      });
    });
  }

  componentWillMount() {
      $.ajax({
        url: "http://localhost/slideshow/public/php/getFolders.php",
        type: 'GET',
        dataType: 'json'
      })
      .done((data) => {
        let folders = Object.values(data);
        this.setState({ folders });
      })
      .fail((e) => {
        console.log(e);
      });
  }


  render() {
    let dropzoneMessage = '';
    if (this.state.disabled) {
      dropzoneMessage = `Uploading disabled.
        Please select a folder to upload to.`;
    } else {
      dropzoneMessage = `Try dropping some files here,
        or click to select files to upload.`;
    }

    return (
      <div>
        <select
          name="selectActiveFolder"
          style={{
            'padding': '20px',
            'fontSize': '200%',
            'borderRadius': '40px'
          }}
          onChange={this.setActiveFolder.bind(this)}
        >
          <option value="">Select a slideshow folder to edit</option>
          <option value="bb1">bb1</option>
          <option value="bb2">bb2</option>
        </select>

        <hr />

        <Dropzone
        onDrop={this.onDrop.bind(this)} disabled={this.state.disabled}
        style={{
            'padding': '50px',
            'border': 'dashed 1px #000',
            'borderRadius': '40px'
        }}
        >
        {}
        <p>{dropzoneMessage}</p>
        </Dropzone>
      </div>
    )
  }
}

export default UploadFiles;

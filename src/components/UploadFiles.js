import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { API_ROOT } from '../api-config';
import $ from 'jquery';

class UploadFiles extends Component {
  onDrop(acceptedFiles) {
    acceptedFiles.forEach(file => {
      // formData: https://stackoverflow.com/a/24939229/3996097
      var formData = new FormData();
      formData.append('photo', file);
      // Set folder to upload file to.
      formData.append('folder', this.props.activeFolder);

      // http://localhost/slideshow/public/php/uploadFiles.php
      $.ajax({
        url: `${API_ROOT}/php/uploadFiles.php`,
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

  render() {
    let dropzoneMessage = '';
    if (this.props.uploadStatus) {
      dropzoneMessage = `Uploading disabled.
        Please select a folder to upload to.`;
    } else {
      dropzoneMessage = `Try dropping some files here,
        or click to select files to upload.`;
    }

    return (
      <Dropzone
        onDrop={this.onDrop.bind(this)} disabled={this.props.uploadStatus}
        style={{
            'padding': '50px',
            'border': 'dashed 10px #000',
        }}
        >
        {}
        <p>{dropzoneMessage}</p>
      </Dropzone>
    )
  }
}

export default UploadFiles;

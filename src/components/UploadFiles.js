import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { API_ROOT } from '../config/api-config';
import $ from 'jquery';
import swal from 'sweetalert2';

class UploadFiles extends Component {
  componentDidMount() {
    // https://stackoverflow.com/a/2907906/3996097
    // Cache selectors outside callback for performance.
    var $window = $(window);
    var $sticky = $('.dropzone');
    var elTop = $sticky.offset().top;

    $window.scroll(function() {
      $sticky.toggleClass('sticky', $window.scrollTop() > elTop);
    });
  }

  onDrop(acceptedFiles) {
    console.log('ondrop')
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
      .done(data => {
        // Check for success.
        if (data === 'File uploaded.') {
          this.props.getFilesInSlideshowDir(this.props.activeFolder);
        // Error.
        } else {
          swal({
            timer: 4000,
            toast: true,
            type: 'error',
            position: 'bottom-end',
            text: 'Error uploading: ' + data
          });;

        }
      })
      .fail(e => {
        console.log(e);
        swal({
          timer: 3000,
          toast: true,
          type: 'error',
          position: 'bottom-end',
          text: 'Error uploading: ' + e
        });;

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
        className="dropzone"
        onDrop={this.onDrop.bind(this)} disabled={this.props.uploadStatus}
      >
        {}
        <p>{dropzoneMessage}</p>
      </Dropzone>
    )
  }
}

export default UploadFiles;

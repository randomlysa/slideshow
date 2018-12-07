import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
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
    console.log('ondrop');
    this.props
      .uploadFile(acceptedFiles, this.props.activeFolder)
      .then(() => {
        console.log('success');
      })
      .catch(returnMessage => {
        swal({
          timer: 4000,
          toast: true,
          type: 'error',
          position: 'bottom-end',
          text: 'Error uploading: ' + returnMessage.error
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
        onDrop={this.onDrop.bind(this)}
        disabled={this.props.uploadStatus}
      >
        {}
        <p>{dropzoneMessage}</p>
      </Dropzone>
    );
  }
}

export default UploadFiles;

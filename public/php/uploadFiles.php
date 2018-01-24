<?php
header("Access-Control-Allow-Origin: *");

// Use later to upload file to correct slideshows folder.
// $folder = $_POST["folder"];

// Adapted from davidwalsh.name/basic-file-uploading-php
if($_FILES['photo']['name']) {

	if(!$_FILES['photo']['error']) {

        // Check for wrong type.
        if($_FILES['photo']['type'] !== 'image/jpeg' ) {
            print "File type not jpeg. Please try again.";
            exit;
        }

        // Check size.
		if($_FILES['photo']['size'] > (3024000)) {
            print "Your file is too large.";
            exit;
		}

        // Move uploaded file to proper directory.
		move_uploaded_file($_FILES['photo']['tmp_name'], '../slideshows/' . $_FILES['photo']['name']);
		print "File uploaded.";

    // Other error.
	} else {
		//set that to be the returned message
		print "Your upload triggered the following error:  " . $_FILES['photo']['error'];
	}
}
?>

<?php
header("Access-Control-Allow-Origin: *");

//  Function to generate a short random string based off the filename.
function randomizeFilename($filename) {
    $getFilename = explode(".", $filename);
    $random =  md5(uniqid($getFilename[0], true));
    return $getFilename[0] . '_' . $random . "." . $getFilename[1];
}

$returnMessage = array();
$newArray = array();

// Adapted from davidwalsh.name/basic-file-uploading-php
if($_FILES['photo']['name']) {

	if(!$_FILES['photo']['error']) {

        // Check for wrong type.
        if($_FILES['photo']['type'] !== 'image/jpeg' ) {
            $newArray['error'] = "File type not jpeg. Please try again.";
            $returnMessage[] = $newArray;
            echo json_encode($returnMessage);
            exit;
        }

        // Check size.
		if($_FILES['photo']['size'] > (3024000)) {
            $newArray['error'] = "Your file is too large.";
            $returnMessage[] = $newArray;
            echo json_encode($returnMessage);
            exit;
        }

        // Check if filename already exists.
        $path = '../slideshows/' . $_POST['folder'] . '/';
        $file =  $_FILES['photo']['name'];
        $newFile = $file;
        while (file_exists($path . $newFile)) {
            // print "Renaming file. $newFile\n";
            $newFile = randomizeFilename($file);
        }

        // Move uploaded file to proper directory.
        move_uploaded_file($_FILES['photo']['tmp_name'], $path . $newFile);
        $newArray['filename'] = $newFile;
        $newArray['md5'] = md5($newFile);
        $returnMessage[] = $newArray;
		// print "File uploaded.";

    // Other error.
	} else {
		//set that to be the returned message
		print "Your upload triggered the following error:  " . $_FILES['photo']['error'];
	}
}

echo json_encode($returnMessage);

?>


<?php

header("Access-Control-Allow-Origin: *");

$fileToDelete = $_POST['fileToDelete'];
$folder = $_POST['folder'];

$listOfFolders = array_diff(scandir('../slideshows'), array('..', '.'));

// Check if specified folder exists in ../slideshows
if (in_array($folder, $listOfFolders) &&
    is_file('../slideshows/' . $folder . '/' . $fileToDelete)) {
    $delete = unlink('../slideshows/' . $folder . '/' . $fileToDelete);
    print $delete;
    exit;
} else {
    print "Error: file or folder not found.";
    exit;
}

?>

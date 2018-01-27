<?php

header("Access-Control-Allow-Origin: *");

$fileToDelete = $_POST['fileToDelete'];
$folder = $_POST['folder'];

$delete = unlink('../slideshows/' . $folder . '/' . $fileToDelete);
print $delete;

?>

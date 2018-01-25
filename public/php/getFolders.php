<?php

header("Access-Control-Allow-Origin: *");

$whichDirToScan = "../slideshows/";

if (!file_exists($whichDirToScan)) {
    echo "Folder <strong>$whichDirToScan</strong> not found.";
    exit;
}

$folders = array();

// http://php.net/manual/en/function.scandir.php#107215
$dirscan = array_diff(scandir($whichDirToScan), array('..', '.'));

foreach($dirscan as $dir) {
    $folders[md5($dir)] = $dir;
}

echo json_encode($folders);

?>

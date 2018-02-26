<?php

header("Access-Control-Allow-Origin: *");

if (isset($_GET["dir"])) {
    $whichDirToScan = "../slideshows/" . $_GET["dir"];
} else {
    $whichDirToScan = "../slideshows/bb1";
}

if (!file_exists($whichDirToScan)) {
    echo $whichDirToScan;
    echo "null";
    exit;
}

// http://php.net/manual/en/function.scandir.php#107215
$dirscan = array_diff(scandir($whichDirToScan), array('..', '.'));

$files = array();
$fileTypes = array('jpg', 'csv');

foreach($dirscan as $file) {
    // https://stackoverflow.com/a/1203361/3996097
    $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    // Will return an int if the extension of the file is in the $fileTypes array.
    $findFile = array_search($extension, $fileTypes);
    if(is_int($findFile)) {
        // Make a new array for each item so an array of objects is returned
        // instead of an object.
        $newArray = array();
        $newArray['file'] = $file;
        $files[] = $newArray;
    }
};

echo json_encode($files);

?>

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

foreach($dirscan as $file) {
    if(preg_match('/.*\.jpg/i', $file)) {
        $files[md5($file)] = $file;
    }
};

echo json_encode($files);

?>

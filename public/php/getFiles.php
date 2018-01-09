<?php

header("Access-Control-Allow-Origin: *");

if (isset($_GET["dir"])) {
    $whichDirToScan = $_GET["dir"];
} else {
    $whichDirToScan = "../bb1";
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

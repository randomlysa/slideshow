<?php

header("Access-Control-Allow-Origin: *");

if (isset($_GET["dir"])) {
    $whichDirToScan = $_GET["dir"];
} else {
    $whichDirToScan = "../bb1";
}

// http://php.net/manual/en/function.scandir.php#107215
$files = array_diff(scandir($whichDirToScan), array('..', '.'));
echo json_encode($files);

?>

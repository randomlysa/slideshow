<?php
  header("Access-Control-Allow-Origin: *");

  // http://theonlytutorials.com/php-pdo-sqlite-example-insert-read-search/
  if($_POST){

    // Define accepted $_POST variables.
    $name = '';
    $slideDuration = '';
    $transitionDuration = '';
    $slidesToShowWeatherOn = '';
    $cityToShowWeatherFor = '';
    $loadedCsv = '';
    $slideOrder = '';


    // foreach ($_POST as $varname => $value) {
    //   ${$varname} = $value;
    // }
    extract ($_POST, EXTR_IF_EXISTS);

    // $name                	= $_POST['name'];
    // $slideDuration        = $_POST['slideDuration'];
    // $transitionDuration   = $_POST['transitionDuration'];
    // $slidesToShowWeatherOn = $_POST['slidesToShowWeatherOn'];
    // $cityToShowWeatherFor = $_POST['cityToShowWeatherFor'];

    // loadedCsv is updated by itself.
    // $loadedCsv            = $_POST['loadedCsv'];

    try{

      include('sqliteConfig.php');

      if ($slideOrder) {
        $stmt = $db -> prepare("UPDATE `bulletins`
          SET
            `slideOrder` = :slideOrder
          WHERE `name` = :name
        ");

        /* bind params */
        $stmt -> bindParam(':name', $name, PDO::PARAM_STR);
        $stmt -> bindParam(':slideOrder', $slideOrder, PDO::PARAM_STR);

      } // End slideOrder.
      else if ($loadedCsv) {
        $stmt = $db -> prepare("UPDATE `bulletins`
          SET
            `loadedCsv` = :loadedCsv
          WHERE `name` = :name
        ");

      /* bind params */
      $stmt -> bindParam(':name', $name, PDO::PARAM_STR);
      $stmt -> bindParam(':loadedCsv', $loadedCsv, PDO::PARAM_STR);

      // End loadedCsv.
      } else {

        /* Create a prepared statement */
        $stmt = $db -> prepare("UPDATE `bulletins`
          SET
            `slideDuration` = :slideDuration,
            `transitionDuration`   = :transitionDuration,
            `slidesToShowWeatherOn` = :slidesToShowWeatherOn,
            `cityToShowWeatherFor` = :cityToShowWeatherFor
          WHERE `name` = :name
        ");

        /* bind params */
        $stmt -> bindParam(':name', $name, PDO::PARAM_STR);
        $stmt -> bindParam(':slideDuration', $slideDuration, PDO::PARAM_INT);
        $stmt -> bindParam(':transitionDuration', $transitionDuration, PDO::PARAM_INT);
        $stmt -> bindParam(':slidesToShowWeatherOn', $slidesToShowWeatherOn, PDO::PARAM_STR);
        $stmt -> bindParam(':cityToShowWeatherFor', $cityToShowWeatherFor, PDO::PARAM_STR);

      }

      /* execute the query */
      if( $stmt -> execute() ){
        echo "Row Updated";
      }

      /* close connection */
      $db = null;
    }
    catch (PDOExecption $e){
      echo $e->getMessage();
    }
  } else {
    print "no post";
  }
?>

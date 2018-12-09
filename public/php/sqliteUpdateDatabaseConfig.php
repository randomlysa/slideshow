<?php
  header("Access-Control-Allow-Origin: *");

  // http://theonlytutorials.com/php-pdo-sqlite-example-insert-read-search/
  if($_POST){

    $timestamp           	= isset($_POST['timestamp']) ? $_POST['timestamp'] : '';
    $name                	= isset($_POST['name']) ? $_POST['name'] : '';
    $slideDuration        = isset($_POST['slideDuration']) ? $_POST['slideDuration'] : '';
    $transitionDuration   = isset($_POST['transitionDuration']) ? $_POST['transitionDuration'] : '';
    $slidesToShowWeatherOn = isset($_POST['slidesToShowWeatherOn']) ? $_POST['slidesToShowWeatherOn'] : '';
    $cityToShowWeatherFor = isset($_POST['cityToShowWeatherFor']) ? $_POST['cityToShowWeatherFor'] : '';
    $slideOrder           = isset($_POST['slideOrder']) ? $_POST['slideOrder']  : '';

    try{

      include('sqliteConfig.php');

      if ($slideOrder && !$slideDuration) {
        $stmt = $db -> prepare("UPDATE `bulletins`
          SET
            `slideOrder` = :slideOrder
          WHERE `name` = :name
        ");

        /* bind params */
        $stmt -> bindParam(':name', $name, PDO::PARAM_STR);
        $stmt -> bindParam(':slideOrder', $slideOrder, PDO::PARAM_STR);

      } // End slideOrder.
      else {

        /* Create a prepared statement */
        $stmt = $db -> prepare("UPDATE `bulletins`
          SET
            `timestamp` = :timestamp,
            `slideDuration` = :slideDuration,
            `transitionDuration`   = :transitionDuration,
            `slidesToShowWeatherOn` = :slidesToShowWeatherOn,
            `cityToShowWeatherFor` = :cityToShowWeatherFor,
            `slideOrder` = :slideOrder
          WHERE `name` = :name
        ");

        /* bind params */
        $stmt -> bindParam(':timestamp', $timestamp, PDO::PARAM_INT);
        $stmt -> bindParam(':name', $name, PDO::PARAM_STR);
        $stmt -> bindParam(':slideDuration', $slideDuration, PDO::PARAM_INT);
        $stmt -> bindParam(':transitionDuration', $transitionDuration, PDO::PARAM_INT);
        $stmt -> bindParam(':slidesToShowWeatherOn', $slidesToShowWeatherOn, PDO::PARAM_STR);
        $stmt -> bindParam(':cityToShowWeatherFor', $cityToShowWeatherFor, PDO::PARAM_STR);
        $stmt -> bindParam(':slideOrder', $slideOrder, PDO::PARAM_STR);
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

<?php
  header("Access-Control-Allow-Origin: *");

  // http://theonlytutorials.com/php-pdo-sqlite-example-insert-read-search/
  if($_POST){
    $timestamp           	= $_POST['timestamp'];
    $name                	= $_POST['name'];
    $slideDuration        = $_POST['slideDuration'];
    $transitionDuration   = $_POST['transitionDuration'];
    $slidesToShowWeatherOn = $_POST['slidesToShowWeatherOn'];
    $cityToShowWeatherFor = $_POST['cityToShowWeatherFor'];
    $slideOrder           = isset($_POST['slideOrder']) ? $_POST['slideOrder']  : '';

    try{

      include('sqliteConfig.php');

      /* Create a prepared statement */
      $stmt = $db -> prepare("INSERT INTO bulletins
        (timestamp, name, slideDuration, transitionDuration, slidesToShowWeatherOn, cityToShowWeatherFor, slideOrder)
        VALUES
        (:timestamp, :name, :slideDuration, :transitionDuration, :slidesToShowWeatherOn, :cityToShowWeatherFor, :slideOrder)
      ");

      /* bind params */
      $stmt -> bindParam(':timestamp', $timestamp, PDO::PARAM_INT);
      $stmt -> bindParam(':name', $name, PDO::PARAM_STR);
      $stmt -> bindParam(':slideDuration', $slideDuration, PDO::PARAM_INT);
      $stmt -> bindParam(':transitionDuration', $transitionDuration, PDO::PARAM_INT);
      $stmt -> bindParam(':slidesToShowWeatherOn', $slidesToShowWeatherOn, PDO::PARAM_STR);
      $stmt -> bindParam(':cityToShowWeatherFor', $cityToShowWeatherFor, PDO::PARAM_STR);
      $stmt -> bindParam(':slideOrder', $slideOrder, PDO::PARAM_STR);

      /* execute the query */
      if( $stmt -> execute() ){
        echo "Row Inserted";
      }

      /* close connection */
      $db = null;
    }
    catch (PDOExecption $e){
      echo $e->getMessage();
    }
  }
?>

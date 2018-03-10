<?php
  header("Access-Control-Allow-Origin: *");

  // http://theonlytutorials.com/php-pdo-sqlite-example-insert-read-search/
  if($_POST){
    $name                	= $_POST['name'];
    $slideDuration        = $_POST['slideDuration'];
    $transitionDuration   = $_POST['transitionDuration'];
    $slidesToShowWeatherOn = $_POST['slidesToShowWeatherOn'];
    $cityToShowWeatherFor = $_POST['cityToShowWeatherFor'];

    try{

      include('sqliteConfig.php');

      /* Create a prepared statement */
      $stmt = $db -> prepare("INSERT INTO bulletins
        (name, slideDuration, transitionDuration, slidesToShowWeatherOn, cityToShowWeatherFor)
        VALUES
        (:name, :slideDuration, :transitionDuration, :slidesToShowWeatherOn, :cityToShowWeatherFor)
      ");

      /* bind params */
      $stmt -> bindParam(':name', $name, PDO::PARAM_STR);
      $stmt -> bindParam(':slideDuration', $slideDuration, PDO::PARAM_INT);
      $stmt -> bindParam(':transitionDuration', $transitionDuration, PDO::PARAM_INT);
      $stmt -> bindParam(':slidesToShowWeatherOn', $slidesToShowWeatherOn, PDO::PARAM_STR);
      $stmt -> bindParam(':cityToShowWeatherFor', $cityToShowWeatherFor, PDO::PARAM_STR);

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

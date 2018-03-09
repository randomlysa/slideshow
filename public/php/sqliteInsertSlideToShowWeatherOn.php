<?php
  header("Access-Control-Allow-Origin: *");

  // http://theonlytutorials.com/php-pdo-sqlite-example-insert-read-search/
  if($_POST){
    $name                	= $_POST['name'];
    $slideToShowWeatherOn = $_POST['slideToShowWeatherOn'];

    try{

      include('sqliteConfig.php');

      $stmt = $db -> prepare("UPDATE bulletins
        SET
        `slideToShowWeatherOn` = :slideToShowWeatherOn
        WHERE `name` = :name
      ");

      /* bind params */
      $stmt -> bindParam(':name', $name, PDO::PARAM_STR);
      $stmt -> bindParam(':slideToShowWeatherOn', $slideToShowWeatherOn, PDO::PARAM_STR);

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
  }
?>

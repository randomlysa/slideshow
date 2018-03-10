<?php
  header("Access-Control-Allow-Origin: *");

  // http://theonlytutorials.com/php-pdo-sqlite-example-insert-read-search/
  if($_POST){
    $name                	= $_POST['name'];
    $slidesToShowWeatherOn = $_POST['slidesToShowWeatherOn'];

    try{

      include('sqliteConfig.php');

      $stmt = $db -> prepare("UPDATE bulletins
        SET
        `slidesToShowWeatherOn` = :slidesToShowWeatherOn
        WHERE `name` = :name
      ");

      /* bind params */
      $stmt -> bindParam(':name', $name, PDO::PARAM_STR);
      $stmt -> bindParam(':slidesToShowWeatherOn', $slidesToShowWeatherOn, PDO::PARAM_STR);

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

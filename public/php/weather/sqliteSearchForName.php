<?php
  header("Access-Control-Allow-Origin: *");

  // http://theonlytutorials.com/php-pdo-sqlite-example-insert-read-search/
  if( $_GET ){
    $name = $_GET['name'];

    try{
      include('sqliteConfigWeather.php');

      /* Create a prepared statement */
      $stmt = $db -> prepare("SELECT * from OPENWEATHER where `name` LIKE :name || '%' LIMIT 5");

      /* bind param */
      $stmt -> bindParam(':name', $name, PDO::PARAM_STR);

      /* execute the query */
      $stmt -> execute();

      /* fetch all results */
      $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

      if ($results) {
        print json_encode($results);
      } else {
        print "null";
      }

      /* close connection */
      $db = null;
    }
    catch (PDOExecption $e){
      echo $e->getMessage();
    }
  }
?>

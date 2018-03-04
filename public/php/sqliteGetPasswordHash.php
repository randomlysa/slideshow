<?php
  header("Access-Control-Allow-Origin: *");

  // http://theonlytutorials.com/php-pdo-sqlite-example-insert-read-search/
  if( $_GET ){
    $username = $_GET['username'];

    try{
      include('sqliteConfig.php');

      /* Create a prepared statement */
      $stmt = $db -> prepare("SELECT * from users where `username` = :username");

      /* bind param */
      $stmt -> bindParam(':username', $username, PDO::PARAM_STR);

      /* execute the query */
      $stmt -> execute();

      /* fetch all results */
      $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

      if ($results) {
        print json_encode($results[0]);
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

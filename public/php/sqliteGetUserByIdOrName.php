<?php
  header("Access-Control-Allow-Origin: *");

  // http://theonlytutorials.com/php-pdo-sqlite-example-insert-read-search/
  if( $_GET ){
    if (isset($_GET["username"])) { $username = $_GET["username"]; } else { $username = null; }
    if (isset($_GET["id"])) { $id = $_GET["id"]; } else { $id = null;}

    try{
      include('sqliteConfig.php');

      if ($id) {
        /* Create a prepared statement */
        $stmt = $db -> prepare("SELECT * from users where `id` = :id");

        /* bind param */
        $stmt -> bindParam(':id', $id, PDO::PARAM_INT);
      }

      if ($username) {
        /* Create a prepared statement */
        $stmt = $db -> prepare("SELECT * from users where `username` = :username");

        /* bind param */
        $stmt -> bindParam(':username', $username, PDO::PARAM_STR);
      }

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

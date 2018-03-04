<?php
  header("Access-Control-Allow-Origin: *");

  // http://theonlytutorials.com/php-pdo-sqlite-example-insert-read-search/
  if($_POST){
    $username   = $_POST['username'];
    $password   = $_POST['password'];
    $email      = $_POST['email'];

    try{

      include('sqliteConfig.php');

      /* Create a prepared statement */
      $stmt = $db -> prepare("INSERT INTO users
        (username, password, email)
        VALUES
        (:username, :password, :email)
      ");

      /* bind params */
      $stmt -> bindParam(':username', $username, PDO::PARAM_STR);
      $stmt -> bindParam(':password', $password, PDO::PARAM_STR);
      $stmt -> bindParam(':email', $email, PDO::PARAM_STR);

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

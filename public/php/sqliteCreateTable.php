<?php
  header("Access-Control-Allow-Origin: *");

  // http://theonlytutorials.com/php-pdo-sqlite-example-insert-read-search/
	try{
		include('sqliteConfig.php');

		/* Create a prepared statement */
		$stmt = $db -> prepare("CREATE TABLE IF NOT EXISTS bulletins
      (id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      slideDuration INT,
      transitionDuration INT,
      slideToShowWeatherOn TEXT,
      cityToShowWeatherFor INT
      );
    ");

		/* execute the query */
		if ($stmt -> execute()) {
			echo "Table is created";
		}

		/* close connection */
		$db = null;
	}
	catch (PDOExecption $e){
		echo $e->getMessage();
	}

?>

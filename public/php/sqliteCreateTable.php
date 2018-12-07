<?php
	header("Access-Control-Allow-Origin: *");

	$env = $_GET["env"];
	if ($env == "") { $env = "production"; }

  // http://theonlytutorials.com/php-pdo-sqlite-example-insert-read-search/
	try{
		include("sqliteConfig.php?env=$env");

		/* Create a prepared statement */
		$stmt = $db -> prepare("CREATE TABLE IF NOT EXISTS bulletins
      (name TEXT PRIMARY KEY,
      slideDuration INT,
      transitionDuration INT,
      slidesToShowWeatherOn TEXT,
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

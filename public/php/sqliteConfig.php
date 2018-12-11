<?php
	header("Access-Control-Allow-Origin: *");

	$env = isset($_GET["env"]) ? $_GET["env"] : 'production';

	if ($env == "production") {
		// http://theonlytutorials.com/php-pdo-sqlite-example-insert-read-search/
		/* Create / Connection to sqlite using PDO and set error mode */
			define('DB_PATH', $_SERVER['DOCUMENT_ROOT'] . '/bulletin.sqlite3');
			$db = new PDO('sqlite:' . DB_PATH);
		/* end */
	} else {
		$docRoot = $_SERVER['DOCUMENT_ROOT'];
		$dbActions = '/slideshow/public/php/';
		$dbPathFile = $docRoot . '/bulletin_TEST.sqlite3';
		define('DB_PATH', $dbPathFile);
		// Delete test db if it exists.
		if (file_exists($dbPathFile)) {
			unlink($dbPathFile);
		}

		// Create test db and connect.
		$db = new PDO('sqlite:' . DB_PATH);

		/* Create a prepared statement */
		$createTable = $db -> prepare("CREATE TABLE IF NOT EXISTS bulletins
			(
			timestamp INT,
			name TEXT PRIMARY KEY,
			slideDuration INT,
			transitionDuration INT,
			slidesToShowWeatherOn TEXT,
			cityToShowWeatherFor INT,
			slideOrder TEXT
			);
		");

		/* execute the query */
		if ($createTable -> execute()) {
			echo "Table is created";
		}

		/* Create Bulletin 1 */
		$timestamp           	= '123456';
    $name                	= 'test1';
    $slideDuration        = '5000';
    $transitionDuration   = '300';
    $slidesToShowWeatherOn = '';
    $cityToShowWeatherFor = '';
    $slideOrder           = '';

		/* Create a prepared statement */
		$createTest1 = $db -> prepare("INSERT INTO bulletins
			(timestamp, name, slideDuration, transitionDuration, slidesToShowWeatherOn, cityToShowWeatherFor, slideOrder)
			VALUES
			(:timestamp, :name, :slideDuration, :transitionDuration, :slidesToShowWeatherOn, :cityToShowWeatherFor, :slideOrder)
		");

		/* bind params */
		$createTest1 -> bindParam(':timestamp', $timestamp, PDO::PARAM_INT);
		$createTest1 -> bindParam(':name', $name, PDO::PARAM_STR);
		$createTest1 -> bindParam(':slideDuration', $slideDuration, PDO::PARAM_INT);
		$createTest1 -> bindParam(':transitionDuration', $transitionDuration, PDO::PARAM_INT);
		$createTest1 -> bindParam(':slidesToShowWeatherOn', $slidesToShowWeatherOn, PDO::PARAM_STR);
		$createTest1 -> bindParam(':cityToShowWeatherFor', $cityToShowWeatherFor, PDO::PARAM_STR);
		$createTest1 -> bindParam(':slideOrder', $slideOrder, PDO::PARAM_STR);

		/* execute the query */
		if( $createTest1 -> execute() ){
			echo "Bulletin test1 created";
		}

		/* Create Bulletin 2 */
		$timestamp           	= '12345678';
    $name                	= 'test2';
    $slideDuration        = '9000';
    $transitionDuration   = '500';
    $slidesToShowWeatherOn = '';
    $cityToShowWeatherFor = '';
    $slideOrder           = '';

		/* Create a prepared statement */
		$createTest2 = $db -> prepare("INSERT INTO bulletins
		(timestamp, name, slideDuration, transitionDuration, slidesToShowWeatherOn, cityToShowWeatherFor, slideOrder)
		VALUES
		(:timestamp, :name, :slideDuration, :transitionDuration, :slidesToShowWeatherOn, :cityToShowWeatherFor, :slideOrder)
		");

		/* bind params */
		$createTest2 -> bindParam(':timestamp', $timestamp, PDO::PARAM_INT);
		$createTest2 -> bindParam(':name', $name, PDO::PARAM_STR);
		$createTest2 -> bindParam(':slideDuration', $slideDuration, PDO::PARAM_INT);
		$createTest2 -> bindParam(':transitionDuration', $transitionDuration, PDO::PARAM_INT);
		$createTest2 -> bindParam(':slidesToShowWeatherOn', $slidesToShowWeatherOn, PDO::PARAM_STR);
		$createTest2 -> bindParam(':cityToShowWeatherFor', $cityToShowWeatherFor, PDO::PARAM_STR);
		$createTest2 -> bindParam(':slideOrder', $slideOrder, PDO::PARAM_STR);

		/* execute the query */
		if( $createTest2 -> execute() ){
			echo "Bulletin test2 created";
		}

	}
?>

<?php
	header("Access-Control-Allow-Origin: *");

	$env = isset($_GET["env"]) ? $_GET["env"] : 'production';
	// Run with ?env=test&create=true to set up db for testing.

	// Set to true to delete test db and init with some data.
	$create = isset($_GET["create"]) ? $_GET["create"] : 'false';

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
		if ($create === 'true' && file_exists($dbPathFile)) {
			unlink($dbPathFile);
		}

		// Create test db and connect.
		$db = new PDO('sqlite:' . DB_PATH);

		// Make folder test1 and test2 so I can switch to them
		// make dummy files in folders?

		if ($env == 'test' && $create == 'true') {
			/* Create a prepared statement */
			$createBulletinsTable = $db -> prepare("CREATE TABLE IF NOT EXISTS bulletins
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
			if ($createBulletinsTable -> execute()) {
				echo "Bulletins table is created<br />";
			}

			$createUsersTable = $db -> prepare("CREATE TABLE IF NOT EXISTS  users (
				`id`	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
				`username`	TEXT NOT NULL UNIQUE,
				`password`	TEXT NOT NULL,
				`email`	TEXT,
				`loggedin`	TEXT
				);
			");

			/* execute the query */
			if ($createUsersTable -> execute()) {
				echo "Users table is created<br />";
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
				echo "Bulletin test1 created<br />";
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
				echo "Bulletin test2 created<br />";
			}

			$username = "test";
			$password = 'pbkdf2$10000$2e37e30ddbe4707f239a216e3668b4054f315fe515db9ea0d1aaa9cd817b1442534bf4ca74eef8f0f92d8a6bc13ee6b6c0c2edaa71637ee7a756cbef900e372a$d31978f0d0ce2bcc28dd70e036404b4d5034bd87be78e6cdc8ebb1818aa9e7bf2d3ac299e1d37be90b6b164847dc6ce9f91e3893fe66f1641d2aeaa49a4aa57d';
			$createUser = $db -> prepare("INSERT INTO users
			(username, password)
			VALUES
			(:username, :password)
			");

			$createUser -> bindParam(':username', $username, PDO::PARAM_STR);
			$createUser -> bindParam(':password', $password, PDO::PARAM_STR);

			if( $createUser -> execute() ){
				echo "Test user created<br />";
			}
		} // if ($create == true)
	}
?>

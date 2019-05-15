<?php
  //Connect to database
  $conn = pg_connect("host='HOST_NAME' port='PORT_NUMBER' dbname='DATABASE_NAME' user='USERNAME' password='PASSWORD'");

  //Take in name/score input from game.js
  $requestPayload = file_get_contents("php://input");
  $object = json_decode($requestPayload, true);

  $username =  $object['name'];
  $score =  $object['score'];

  $query = "SELECT username, score FROM scores ORDER BY score ASC";

  $insertQuery = "INSERT INTO scores (score, username) VALUES ('$score', '$username')";

  //Insert input into database
  if (strlen($username) > 0) {
    pg_query($conn, $insertQuery);
  }

  //Retrieve all rows from database
  $result = pg_query($conn, $query);

  $table = array();

  while ($row = pg_fetch_row($result)) {
    array_push($table, $row[0], $row[1]);
  }

  //Return all rows to game.js
  header('Content-type: application/json; charset = utf-8');
  echo json_encode($table);

?>

<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root'); // Change as needed
define('DB_PASS', ''); // Change as needed
define('DB_NAME', 'travel_db');

// Create connection
function getConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS);
    
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    // Create database if it doesn't exist
    $sql = "CREATE DATABASE IF NOT EXISTS " . DB_NAME;
    if ($conn->query($sql) === FALSE) {
        die("Error creating database: " . $conn->error);
    }
    
    // Select the database
    $conn->select_db(DB_NAME);
    
    // Create packages table if it doesn't exist
    $sql = "CREATE TABLE IF NOT EXISTS packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        package_name VARCHAR(100) NOT NULL,
        location VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        start_date DATE NOT NULL,
        seats INT NOT NULL
    )";
    
    if ($conn->query($sql) === FALSE) {
        die("Error creating table: " . $conn->error);
    }
    
    return $conn;
}
?>
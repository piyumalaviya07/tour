<?php
// Script to add more packages to the database

// Include database configuration
require_once 'api/config/database.php';

// Create database connection
$database = new Database();
$conn = $database->getConnection();

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

echo "<h2>Adding more tour packages to the database...</h2>";

// Read the SQL file
$sql_file = file_get_contents('add_more_packages.sql');

// Split into individual queries
$queries = explode(';', $sql_file);

// Execute each query
$success_count = 0;
$error_count = 0;

foreach ($queries as $query) {
    $query = trim($query);
    
    // Skip empty queries
    if (empty($query)) continue;
    
    // Execute query
    if ($conn->query($query)) {
        echo "<p style='color:green'>Success: " . substr($query, 0, 50) . "...</p>";
        $success_count++;
    } else {
        echo "<p style='color:red'>Error: " . $conn->error . "<br>Query: " . substr($query, 0, 50) . "...</p>";
        $error_count++;
    }
}

// Summary
echo "<h3>Summary:</h3>";
echo "<p>Successfully executed queries: $success_count</p>";
echo "<p>Failed queries: $error_count</p>";

echo "<p><a href='public/index.html'>Go to homepage</a></p>";
echo "<p><a href='public/packages.html'>View all packages</a></p>";

// Close connection
$conn->close();
?>
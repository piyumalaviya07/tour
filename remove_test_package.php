<?php
// Script to remove test package and update packages

// Include database configuration
require_once 'api/config/database.php';

// Create database connection
$database = new Database();
$conn = $database->getConnection();

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

echo "<h2>Removing test package and updating packages...</h2>";

// Read the SQL file
$sql_file = file_get_contents('remove_test_package.sql');

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

// Now check if we need to add more packages
echo "<h3>Checking if we need to add more packages...</h3>";

// Count packages
$result = $conn->query("SELECT COUNT(*) as count FROM packages");
$row = $result->fetch_assoc();
$package_count = $row['count'];

echo "<p>Current package count: $package_count</p>";

// If we have fewer than 10 packages, run the add_packages.php script
if ($package_count < 10) {
    echo "<p>Adding more packages from add_packages.sql...</p>";
    
    // Read the SQL file
    $sql_file = file_get_contents('add_packages.sql');
    
    // Split into individual queries
    $queries = explode(';', $sql_file);
    
    // Execute each query
    foreach ($queries as $query) {
        $query = trim($query);
        
        // Skip empty queries
        if (empty($query)) continue;
        
        // Execute query
        if ($conn->query($query)) {
            echo "<p style='color:green'>Success: " . substr($query, 0, 50) . "...</p>";
        } else {
            echo "<p style='color:red'>Error: " . $conn->error . "<br>Query: " . substr($query, 0, 50) . "...</p>";
        }
    }
}

// Add more packages from add_more_packages.sql
echo "<p>Adding more packages from add_more_packages.sql...</p>";

// Read the SQL file
$sql_file = file_get_contents('add_more_packages.sql');

// Split into individual queries
$queries = explode(';', $sql_file);

// Execute each query
$added_count = 0;
foreach ($queries as $query) {
    $query = trim($query);
    
    // Skip empty queries
    if (empty($query)) continue;
    
    // Execute query
    if ($conn->query($query)) {
        echo "<p style='color:green'>Success: " . substr($query, 0, 50) . "...</p>";
        $added_count++;
    } else {
        echo "<p style='color:red'>Error: " . $conn->error . "<br>Query: " . substr($query, 0, 50) . "...</p>";
    }
}

echo "<p>Added $added_count new packages.</p>";

// Final package count
$result = $conn->query("SELECT COUNT(*) as count FROM packages");
$row = $result->fetch_assoc();
$package_count = $row['count'];

echo "<p>Final package count: $package_count</p>";

echo "<p><a href='public/index.html'>Go to homepage</a></p>";
echo "<p><a href='public/packages.html'>View all packages</a></p>";

// Close connection
$conn->close();
?>
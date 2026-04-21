<?php
// Script to add sample packages to the database
require_once __DIR__ . '/api/config/database.php';

// Get database connection
$conn = getConnection();

// Read SQL file
$sql = file_get_contents(__DIR__ . '/add_packages.sql');

// Execute SQL statements
if ($conn->multi_query($sql)) {
    $count = 0;
    do {
        // Store result
        if ($result = $conn->store_result()) {
            $result->free();
        }
        $count++;
    } while ($conn->more_results() && $conn->next_result());
    
    echo "Successfully added $count packages to the database.";
} else {
    echo "Error adding packages: " . $conn->error;
}

// Close connection
$conn->close();
?>
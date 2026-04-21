<?php
/**
 * ExploreEase API Test Script
 * 
 * This script tests all API endpoints for the ExploreEase Travel Booking API.
 * Run this script from the command line to verify API functionality.
 */

// Configuration
$base_url = 'http://localhost/api'; // Update this with your actual API URL
$test_package = [
    'package_name' => 'Test Package ' . time(),
    'location' => 'Test Location',
    'price' => 999.99,
    'start_date' => date('Y-m-d', strtotime('+30 days')),
    'seats' => 20
];

// Colors for console output
define('COLOR_GREEN', "\033[32m");
define('COLOR_RED', "\033[31m");
define('COLOR_YELLOW', "\033[33m");
define('COLOR_RESET', "\033[0m");

// Test counter
$tests_run = 0;
$tests_passed = 0;

// Helper functions
function makeRequest($method, $endpoint, $data = null) {
    global $base_url;
    
    $url = $base_url . $endpoint;
    $curl = curl_init();
    
    $options = [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => $method
    ];
    
    if ($data !== null) {
        $options[CURLOPT_POSTFIELDS] = json_encode($data);
        $options[CURLOPT_HTTPHEADER] = ['Content-Type: application/json'];
    }
    
    curl_setopt_array($curl, $options);
    
    $response = curl_exec($curl);
    $status_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    
    curl_close($curl);
    
    return [
        'status' => $status_code,
        'body' => json_decode($response, true)
    ];
}

function assertTest($condition, $message) {
    global $tests_run, $tests_passed;
    $tests_run++;
    
    if ($condition) {
        echo COLOR_GREEN . "✓ PASS: $message" . COLOR_RESET . "\n";
        $tests_passed++;
    } else {
        echo COLOR_RED . "✗ FAIL: $message" . COLOR_RESET . "\n";
    }
}

function runTestSection($title, $callback) {
    echo "\n" . COLOR_YELLOW . "=== $title ===" . COLOR_RESET . "\n";
    $callback();
}

// Start testing
echo "\n" . COLOR_YELLOW . "ExploreEase API Test Script" . COLOR_RESET . "\n";
echo "Testing API at: $base_url\n";

// Test 1: Create a package
runTestSection("Creating a new package", function() use (&$test_package, &$created_package_id) {
    $response = makeRequest('POST', '/packages', $test_package);
    
    assertTest($response['status'] === 201, "Status code should be 201 Created");
    assertTest(isset($response['body']['package']), "Response should contain package data");
    assertTest($response['body']['package']['package_name'] === $test_package['package_name'], 
              "Package name should match");
    
    if (isset($response['body']['package']['id'])) {
        $created_package_id = $response['body']['package']['id'];
        echo "Created package with ID: $created_package_id\n";
    }
});

// Test 2: Get all packages
runTestSection("Getting all packages", function() {
    $response = makeRequest('GET', '/packages');
    
    assertTest($response['status'] === 200, "Status code should be 200 OK");
    assertTest(is_array($response['body']), "Response should be an array");
    assertTest(count($response['body']) > 0, "At least one package should exist");
});

// Test 3: Get single package
runTestSection("Getting a single package", function() use ($created_package_id, $test_package) {
    if (!isset($created_package_id)) {
        echo COLOR_YELLOW . "Skipping test: No package ID available" . COLOR_RESET . "\n";
        return;
    }
    
    $response = makeRequest('GET', "/packages/$created_package_id");
    
    assertTest($response['status'] === 200, "Status code should be 200 OK");
    assertTest($response['body']['id'] == $created_package_id, "Package ID should match");
    assertTest($response['body']['package_name'] === $test_package['package_name'], 
              "Package name should match");
});

// Test 4: Update package
runTestSection("Updating a package", function() use ($created_package_id, &$test_package) {
    if (!isset($created_package_id)) {
        echo COLOR_YELLOW . "Skipping test: No package ID available" . COLOR_RESET . "\n";
        return;
    }
    
    $updated_data = $test_package;
    $updated_data['package_name'] = $test_package['package_name'] . ' (Updated)';
    $updated_data['price'] = 1099.99;
    
    $response = makeRequest('PUT', "/packages/$created_package_id", $updated_data);
    
    assertTest($response['status'] === 200, "Status code should be 200 OK");
    assertTest(isset($response['body']['package']), "Response should contain package data");
    assertTest($response['body']['package']['package_name'] === $updated_data['package_name'], 
              "Package name should be updated");
    assertTest($response['body']['package']['price'] == $updated_data['price'], 
              "Package price should be updated");
    
    // Update test package for future tests
    $test_package = $updated_data;
});

// Test 5: Validation tests
runTestSection("Testing validation rules", function() {
    // Test empty package name
    $invalid_data = [
        'package_name' => '',
        'location' => 'Test Location',
        'price' => 999.99,
        'start_date' => date('Y-m-d', strtotime('+30 days')),
        'seats' => 20
    ];
    
    $response = makeRequest('POST', '/packages', $invalid_data);
    assertTest($response['status'] === 400, "Empty package name: Status code should be 400 Bad Request");
    
    // Test invalid price
    $invalid_data = [
        'package_name' => 'Test Package',
        'location' => 'Test Location',
        'price' => -50,
        'start_date' => date('Y-m-d', strtotime('+30 days')),
        'seats' => 20
    ];
    
    $response = makeRequest('POST', '/packages', $invalid_data);
    assertTest($response['status'] === 400, "Negative price: Status code should be 400 Bad Request");
    
    // Test empty location
    $invalid_data = [
        'package_name' => 'Test Package',
        'location' => '',
        'price' => 999.99,
        'start_date' => date('Y-m-d', strtotime('+30 days')),
        'seats' => 20
    ];
    
    $response = makeRequest('POST', '/packages', $invalid_data);
    assertTest($response['status'] === 400, "Empty location: Status code should be 400 Bad Request");
    
    // Test past date
    $invalid_data = [
        'package_name' => 'Test Package',
        'location' => 'Test Location',
        'price' => 999.99,
        'start_date' => date('Y-m-d', strtotime('-30 days')),
        'seats' => 20
    ];
    
    $response = makeRequest('POST', '/packages', $invalid_data);
    assertTest($response['status'] === 400, "Past date: Status code should be 400 Bad Request");
    
    // Test invalid seats
    $invalid_data = [
        'package_name' => 'Test Package',
        'location' => 'Test Location',
        'price' => 999.99,
        'start_date' => date('Y-m-d', strtotime('+30 days')),
        'seats' => 0
    ];
    
    $response = makeRequest('POST', '/packages', $invalid_data);
    assertTest($response['status'] === 400, "Zero seats: Status code should be 400 Bad Request");
});

// Test 6: Delete package
runTestSection("Deleting a package", function() use ($created_package_id) {
    if (!isset($created_package_id)) {
        echo COLOR_YELLOW . "Skipping test: No package ID available" . COLOR_RESET . "\n";
        return;
    }
    
    $response = makeRequest('DELETE', "/packages/$created_package_id");
    
    assertTest($response['status'] === 200, "Status code should be 200 OK");
    assertTest(isset($response['body']['message']), "Response should contain success message");
    
    // Verify package is deleted
    $check_response = makeRequest('GET', "/packages/$created_package_id");
    assertTest($check_response['status'] === 404, "Deleted package should return 404 Not Found");
});

// Test summary
echo "\n" . COLOR_YELLOW . "=== Test Summary ===" . COLOR_RESET . "\n";
echo "Tests run: $tests_run\n";
echo "Tests passed: $tests_passed\n";

if ($tests_run === $tests_passed) {
    echo COLOR_GREEN . "All tests passed!" . COLOR_RESET . "\n";
} else {
    echo COLOR_RED . ($tests_run - $tests_passed) . " tests failed." . COLOR_RESET . "\n";
}

echo "\nTo test the UI functionality, please:";
echo "\n1. Open the homepage at http://localhost/public/index.html";
echo "\n2. Navigate to the Packages page and verify packages are displayed";
echo "\n3. Navigate to the Admin page and test CRUD operations";
echo "\n4. Verify that validation works on the Admin page forms";
echo "\n\n";
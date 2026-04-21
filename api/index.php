<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Include controller
require_once __DIR__ . '/controllers/PackageController.php';

// Get request URI
$request_uri = $_SERVER['REQUEST_URI'];

// Extract path from URI
$path = parse_url($request_uri, PHP_URL_PATH);

// Remove base path if needed (adjust as necessary)
$base_path = '/tour/api';
if (strpos($path, $base_path) === 0) {
    $path = substr($path, strlen($base_path));
}

// Parse the path
$path_parts = explode('/', trim($path, '/'));

// Check if we're dealing with packages endpoint
if (isset($path_parts[0]) && $path_parts[0] === 'packages') {
    $controller = new PackageController();
    
    // Check if ID is provided
    $id = isset($path_parts[1]) && is_numeric($path_parts[1]) ? (int)$path_parts[1] : null;
    
    // Handle request
    $controller->handleRequest($_SERVER['REQUEST_METHOD'], $id);
} else {
    // Invalid endpoint
    header('Content-Type: application/json');
    http_response_code(404);
    echo json_encode(['error' => 'Endpoint not found']);
}
?>
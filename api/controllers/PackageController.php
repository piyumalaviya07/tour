<?php
require_once __DIR__ . '/../models/Package.php';

class PackageController {
    private $package;
    
    public function __construct() {
        $this->package = new Package();
    }
    
    // Handle API requests
    public function handleRequest($method, $id = null) {
        header('Content-Type: application/json');
        
        switch ($method) {
            case 'GET':
                if ($id) {
                    $this->getPackage($id);
                } else {
                    $this->getAllPackages();
                }
                break;
                
            case 'POST':
                $this->createPackage();
                break;
                
            case 'PUT':
                if ($id) {
                    $this->updatePackage($id);
                } else {
                    $this->sendResponse(400, ['error' => 'Package ID is required for update']);
                }
                break;
                
            case 'DELETE':
                if ($id) {
                    $this->deletePackage($id);
                } else {
                    $this->sendResponse(400, ['error' => 'Package ID is required for deletion']);
                }
                break;
                
            default:
                $this->sendResponse(405, ['error' => 'Method not allowed']);
                break;
        }
    }
    
    // Get all packages
    private function getAllPackages() {
        $packages = $this->package->readAll();
        $this->sendResponse(200, $packages);
    }
    
    // Get single package
    private function getPackage($id) {
        $package = $this->package->readOne($id);
        
        if ($package) {
            $this->sendResponse(200, $package);
        } else {
            $this->sendResponse(404, ['error' => 'Package not found']);
        }
    }
    
    // Create new package
    private function createPackage() {
        // Get posted data
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            $this->sendResponse(400, ['error' => 'Invalid JSON data']);
            return;
        }
        
        $result = $this->package->create($data);
        
        if ($result['success']) {
            $this->sendResponse(201, ['message' => 'Package created successfully', 'id' => $result['id']]);
        } else {
            if (isset($result['errors'])) {
                $this->sendResponse(400, ['error' => 'Validation failed', 'details' => $result['errors']]);
            } else {
                $this->sendResponse(500, ['error' => $result['message']]);
            }
        }
    }
    
    // Update package
    private function updatePackage($id) {
        // Check if package exists
        $package = $this->package->readOne($id);
        
        if (!$package) {
            $this->sendResponse(404, ['error' => 'Package not found']);
            return;
        }
        
        // Get posted data
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            $this->sendResponse(400, ['error' => 'Invalid JSON data']);
            return;
        }
        
        $result = $this->package->update($id, $data);
        
        if ($result['success']) {
            $this->sendResponse(200, ['message' => 'Package updated successfully']);
        } else {
            if (isset($result['errors'])) {
                $this->sendResponse(400, ['error' => 'Validation failed', 'details' => $result['errors']]);
            } else {
                $this->sendResponse(500, ['error' => $result['message']]);
            }
        }
    }
    
    // Delete package
    private function deletePackage($id) {
        // Check if package exists
        $package = $this->package->readOne($id);
        
        if (!$package) {
            $this->sendResponse(404, ['error' => 'Package not found']);
            return;
        }
        
        $result = $this->package->delete($id);
        
        if ($result['success']) {
            $this->sendResponse(200, ['message' => 'Package deleted successfully']);
        } else {
            $this->sendResponse(500, ['error' => $result['message']]);
        }
    }
    
    // Send API response
    private function sendResponse($statusCode, $data) {
        http_response_code($statusCode);
        echo json_encode($data);
        exit;
    }
}
?>
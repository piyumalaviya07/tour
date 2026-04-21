<?php
require_once __DIR__ . '/../config/database.php';

class Package {
    // Database connection
    private $conn;
    
    // Package properties
    public $id;
    public $package_name;
    public $location;
    public $price;
    public $start_date;
    public $seats;
    
    // Constructor with database connection
    public function __construct() {
        $this->conn = getConnection();
    }
    
    // Create a new package
    public function create($data) {
        // Validate data
        $errors = $this->validate($data);
        if (!empty($errors)) {
            return ['success' => false, 'errors' => $errors];
        }
        
        // Prepare SQL statement
        $stmt = $this->conn->prepare("INSERT INTO packages (package_name, location, price, start_date, seats) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssdsi", $data['package_name'], $data['location'], $data['price'], $data['start_date'], $data['seats']);
        
        // Execute query
        if ($stmt->execute()) {
            return ['success' => true, 'id' => $this->conn->insert_id];
        }
        
        return ['success' => false, 'message' => 'Failed to create package: ' . $stmt->error];
    }
    
    // Read all packages
    public function readAll() {
        $query = "SELECT * FROM packages ORDER BY id DESC";
        $result = $this->conn->query($query);
        
        $packages = [];
        
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $packages[] = $row;
            }
        }
        
        return $packages;
    }
    
    // Read single package
    public function readOne($id) {
        $stmt = $this->conn->prepare("SELECT * FROM packages WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            return $result->fetch_assoc();
        }
        
        return null;
    }
    
    // Update package
    public function update($id, $data) {
        // Validate data
        $errors = $this->validate($data);
        if (!empty($errors)) {
            return ['success' => false, 'errors' => $errors];
        }
        
        // Prepare SQL statement
        $stmt = $this->conn->prepare("UPDATE packages SET package_name = ?, location = ?, price = ?, start_date = ?, seats = ? WHERE id = ?");
        $stmt->bind_param("ssdsii", $data['package_name'], $data['location'], $data['price'], $data['start_date'], $data['seats'], $id);
        
        // Execute query
        if ($stmt->execute()) {
            return ['success' => true];
        }
        
        return ['success' => false, 'message' => 'Failed to update package: ' . $stmt->error];
    }
    
    // Delete package
    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM packages WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            return ['success' => true];
        }
        
        return ['success' => false, 'message' => 'Failed to delete package: ' . $stmt->error];
    }
    
    // Validate package data
    private function validate($data) {
        $errors = [];
        
        // Package name validation
        if (empty($data['package_name'])) {
            $errors['package_name'] = 'Package name cannot be empty';
        }
        
        // Price validation
        if (!isset($data['price']) || !is_numeric($data['price']) || $data['price'] <= 0) {
            $errors['price'] = 'Price must be numeric and greater than 0';
        }
        
        // Location validation
        if (empty($data['location'])) {
            $errors['location'] = 'Location cannot be empty';
        } else {
            // List of popular Indian states/cities for validation
            $indian_locations = [
                'Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad', 'Ahmedabad',
                'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
                'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
                'Rajasthan', 'Kerala', 'Goa', 'Himachal Pradesh', 'Uttarakhand', 'Kashmir',
                'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Gujarat', 'Maharashtra',
                'Varanasi', 'Amritsar', 'Udaipur', 'Rishikesh', 'Darjeeling', 'Shimla', 'Manali',
                'Ooty', 'Munnar', 'Kovalam', 'Alleppey', 'Mysore', 'Hampi', 'Pondicherry'
            ];
            
            // Optional validation - can be enabled if strict location checking is required
            // Commented out to allow flexibility in adding new locations
            /*
            $location_valid = false;
            foreach ($indian_locations as $loc) {
                if (stripos($data['location'], $loc) !== false) {
                    $location_valid = true;
                    break;
                }
            }
            
            if (!$location_valid) {
                $errors['location'] = 'Please enter a valid Indian location';
            }
            */
        }
        
        // Start date validation
        $today = date('Y-m-d');
        if (empty($data['start_date']) || strtotime($data['start_date']) <= strtotime($today)) {
            $errors['start_date'] = 'Start date must be a future date';
        }
        
        // Seats validation
        if (!isset($data['seats']) || !is_numeric($data['seats']) || $data['seats'] <= 0 || floor($data['seats']) != $data['seats']) {
            $errors['seats'] = 'Seats must be an integer greater than 0';
        }
        
        return $errors;
    }
}
?>